import { Controller, Get, Param, Put, UseGuards, Post, UseInterceptors, Res, UseFilters, Req } from "@nestjs/common";
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
import { Response } from "express";
import { PerPage } from "@utils/PerPage";
import { Page } from "@utils/Page";
import { QueryFailedFilter } from "@filters/query-failed.filter";
import { EntityNotFoundFilter } from "@filters/entity-not-found.filter";

@Controller("users")
@UseGuards(...SessionGuard)
@UseInterceptors(CrudFilterInterceptor)
@SetGroupMappers({
	own_user: (req: MyRequest<User>) => req.params?.id && req.user?.id === req.params?.id,
})
@UseFilters(QueryFailedFilter, EntityNotFoundFilter)
export class UsersController {
	constructor(
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
	async getAll(
		@Page() page: number,
		@PerPage() per_page: number,
		@Res({ passthrough: true }) res: Response,
	): Promise<object> {
		const [ret, total] = await this.userService.findAllAndCount(page, per_page);
		res.setHeader("total_entities", total);
		res.setHeader("total_pages", Math.ceil(total / per_page));
		return ret;
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
	update(
		@Param("id") id: string,
		@MyRequestPipe(...getPutPipeline(User)) user: User,
		@Req() req: Request,
	): Promise<object> {
		return this.userService.getQuery().is(req.user.id).update(id, user);
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

	/**
	 * get all games of an user
	 */
	@Get(":id/games")
	async getGames(
		@Param("id") id: string,
		@Res({ passthrough: true }) res: Response,
		@Page() page: number,
		@PerPage() per_page: number,
	): Promise<object> {
		const [ret, total] = await this.gameService.getQuery().in_game(id).paginate(page, per_page).getManyAndCount();
		res.setHeader("total_entities", total);
		res.setHeader("total_pages", Math.ceil(total / per_page));
		return ret;
	}

	/**
	 * get all relations of a user
	 */
	@Get(":id/relations")
	async getRelations(
		@Param("id") id: string,
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
		@Page() page: number,
		@PerPage() per_page: number,
	): Promise<object> {
		const [ret, total] = await this.relationService
			.getReq()
			.in_relation(req.user.id)
			.in_relation(id)
			.paginate(page, per_page)
			.getManyAndCount();
		res.setHeader("total_entities", total);
		res.setHeader("total_pages", Math.ceil(total / per_page));
		return ret;
	}

	/**
	 * get all chanConnections of a user
	 */
	@Get(":id/chan_connections")
	async getChanConnections(
		@Param("id") id: string,
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
		@Page() page: number,
		@PerPage() per_page: number,
	): Promise<object> {
		const [ret, total] = await this.chanConnectionService
			.getQuery()
			.see_connection(req.user.id)
			.user(id)
			.paginate(page, per_page)
			.getManyAndCount();
		res.setHeader("total_entities", total);
		res.setHeader("total_pages", Math.ceil(total / per_page));
		return ret;
	}

	/**
	 * get all messages sent by a user
	 */
	@Get(":id/messages")
	async getMessages(
		@Param("id") id: string,
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
		@Page() page: number,
		@PerPage() per_page: number,
	): Promise<object> {
		const [ret, total] = await this.messageService
			.getQuery()
			.see_message(req.user.id)
			.user(id)
			.paginate(page, per_page)
			.getManyAndCount();
		res.setHeader("total_entities", total);
		res.setHeader("total_pages", Math.ceil(total / per_page));
		return ret;
	}
}
