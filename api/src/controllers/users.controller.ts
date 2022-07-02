import { Controller, Get, Param, Post, Put, Req, UseFilters, UseGuards, UseInterceptors } from "@nestjs/common";
import { UserService } from "@services/user.service";
import { DevelopmentGuard } from "@src/guards/development.guard";
import { GameService } from "@services/game.service";
import { RelationService } from "@services/relation.service";
import { MessageService } from "@services/message.service";
import { ChanConnectionService } from "@services/chan_connection.service";
import { User } from "@entities/user.entity";
import { MyRequestPipe } from "@utils/myRequestPipe";
import { getPutPipeline } from "@utils/getPutPipeline";
import { getPostPipeline } from "@utils/getPostPipeline";
import { CrudFilterInterceptor } from "@interceptors/crud-filter.interceptor";
import { SessionGuard } from "@guards/session.guard";
import { Request, Request as MyRequest } from "@src/types/request";
import { SetGroupMappers } from "@utils/setGroupMappers";
import { PerPage } from "@utils/PerPage";
import { Page } from "@utils/Page";
import { TypeormErrorFilter } from "@filters/typeorm-error.filter";
import { PaginatedResponse } from "@src/types/paginated-response";
import { Game } from "@entities/game.entity";
import { Relation, RelationType } from "@entities/relation.entity";
import { ChanConnection } from "@entities/chan_connection.entity";
import { Message } from "@entities/message.entity";
import { PaginationInterceptor } from "@interceptors/pagination.interceptor";
import { Channel, ChannelType } from "@src/entities/channel.entity";
import { ChannelService } from "@services/channel.service";

@Controller("users")
@UseGuards(...SessionGuard)
@UseInterceptors(CrudFilterInterceptor, PaginationInterceptor)
@SetGroupMappers({
	own_user: (req: MyRequest<User>) => req.params?.id && req.user?.id === req.params?.id,
})
@UseFilters(TypeormErrorFilter)
export class UsersController {
	constructor(
		private channelService: ChannelService,
		private userService: UserService,
		private gameService: GameService,
		private relationService: RelationService,
		private messageService: MessageService,
		private chanConnectionService: ChanConnectionService,
	) {}

	/**
	 * get all visible users
	 */
	@Get()
	getAll(@Page() page: number, @PerPage() per_page: number): Promise<PaginatedResponse<User>> {
		return this.userService.findAllAndCount(page, per_page);
	}

	/**
	 * get the user designated by id
	 * @param id
	 */
	@Get(":id")
	async getOne(@Param("id") id: string): Promise<object> {
		return await this.userService.findOne(id);
	}

	/**
	 * edit the user designated by id
	 */
	@Put(":id")
	async update(@Param("id") id: string, @MyRequestPipe(...getPutPipeline(User)) user: User, @Req() req: Request) {
		await this.userService.getQuery().is(req.user.id).update(id, user);
	}

	/**
	 * create a user
	 * @Warning only works in development
	 * @param user
	 */
	@Post()
	@UseGuards(DevelopmentGuard)
	create(@MyRequestPipe(...getPostPipeline(User)) user: User) {
		return this.userService.create(user);
	}

	@Post(":id/invite_friend")
	inviteFriend(@Param("id") id: string, @Req() req: Request): Promise<object> {
		return this.relationService.create({ type: RelationType.FRIEND_REQUEST, owner: req.user, target: { id } });
	}

	@Post(":id/block")
	block(@Param("id") id: string, @Req() req: Request): Promise<object> {
		return this.relationService.create({ type: RelationType.BLOCK, owner: req.user, target: { id } });
	}

	/**
	 * get all games of an user
	 */
	@Get(":id/dm")
	async dm(@Param("id") id: string, @Req() req: MyRequest): Promise<Channel> {
		let chan = await this.channelService
			.getQuery()
			.on_channel(id)
			.on_channel(req.user.id)
			.type(ChannelType.DM)
			.getOne();
		// if the chan does not exist yet, create it and put the users in it
		if (!chan) {
			chan = await this.channelService
				.getQuery()
				.create({ type: ChannelType.DM, name: `${req.user.id} - ${id}` });
			await this.chanConnectionService.getQuery().create({ channel: chan, user: req.user });
			await this.chanConnectionService.getQuery().create({ channel: chan, user: { id } });
		}
		return chan;
	}

	/**
	 * get all games of an user
	 */
	@Get(":id/games")
	getGames(
		@Param("id") id: string,
		@Page() page: number,
		@PerPage() per_page: number,
	): Promise<PaginatedResponse<Game>> {
		return this.gameService.getQuery().in_game(id).paginate(page, per_page).getManyAndCount();
	}

	/**
	 * get all relations of a user
	 */
	@Get(":id/relations")
	getRelations(
		@Param("id") id: string,
		@Req() req: Request,
		@Page() page: number,
		@PerPage() per_page: number,
	): Promise<PaginatedResponse<Relation>> {
		return this.relationService
			.getReq()
			.in_relation(req.user.id)
			.in_relation(id)
			.paginate(page, per_page)
			.getManyAndCount();
	}

	/**
	 * get all chanConnections of a user
	 */
	@Get(":id/chan_connections")
	getChanConnections(
		@Param("id") id: string,
		@Req() req: Request,
		@Page() page: number,
		@PerPage() per_page: number,
	): Promise<PaginatedResponse<ChanConnection>> {
		return this.chanConnectionService
			.getQuery()
			.see_connection(req.user.id)
			.user(id)
			.paginate(page, per_page)
			.getManyAndCount();
	}

	/**
	 * get all messages sent by a user
	 */
	@Get(":id/messages")
	getMessages(
		@Param("id") id: string,
		@Req() req: Request,
		@Page() page: number,
		@PerPage() per_page: number,
	): Promise<PaginatedResponse<Message>> {
		return this.messageService
			.getQuery()
			.see_message(req.user.id)
			.user(id)
			.paginate(page, per_page)
			.getManyAndCount();
	}
}
