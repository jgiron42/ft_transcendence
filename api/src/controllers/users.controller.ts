import { Controller, Get, Param, Put, UseGuards, Session, Post, UseInterceptors } from "@nestjs/common";
import { IsUserGuard } from "@guards/is-user.guard";
import { UserService } from "@services/user.service";
import { SessionT } from "@src/types/session";
import { DevelopmentGuard } from "@src/guards/development.guard";
import { GameService } from "@services/game.service";
import { RelationService } from "@services/relation.service";
import { MessageService } from "@services/message.service";
import { ChanConnectionService } from "@services/chan_connection.service";
import { User } from "@entities/user.entity";
import { RequestPipeDecorator } from "@src/utils/requestPipeDecorator";
import { CrudClassFilter } from "@utils/crud-class-filter";
import { getPutPipeline } from "@utils/getPutPipeline";
import { getPostPipeline } from "@utils/getPostPipeline";
import { CrudFilterInterceptor } from "@interceptors/crud-filter.interceptor";
// import { SessionGuard } from "@guards/session.guard";

@Controller("users")
// @UseGuards(...SessionGuard)
@UseInterceptors(CrudFilterInterceptor)
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
	getAll(): Promise<object> {
		return this.userService.findAll();
	}

	/**
	 * get the user designated by id
	 * @param id
	 */
	@Get(":id")
	@UseGuards()
	async getOne(@Param("id") id: string, @Session() ses: SessionT): Promise<object> {
		// return the private version if the current user is id
		if (ses.user && id === ses.user.id)
			return CrudClassFilter(await this.userService.findOne(id), "r", ["private"]);
		return CrudClassFilter(await this.userService.findOne(id), "r");
	}

	/**
	 * edit the user designated by id
	 * @param user
	 */
	@Put(":id")
	@UseGuards(IsUserGuard)
	update(@RequestPipeDecorator(...getPutPipeline(User, UserService)) user: User): Promise<object> {
		return this.userService.create(user);
	}

	/**
	 * create a user
	 * @Warning only works in development
	 * @param user
	 */
	@Post()
	@UseGuards(DevelopmentGuard)
	create(@RequestPipeDecorator(...getPostPipeline(User)) user: User): Promise<object> {
		return this.userService.create(user);
	}

	/**
	 * get all games of an user
	 * @param id the user's id
	 */
	@Get(":id/games")
	@UseGuards()
	getGames(@Param("id") id: string): Promise<object> {
		return this.gameService.findByUser(id);
	}

	/**
	 * get all relations of a user
	 * @param id the user's id
	 */
	@Get(":id/relations")
	@UseGuards(IsUserGuard)
	getRelations(@Param("id") id: string): Promise<object> {
		return this.relationService.findByUser(id);
	}

	/**
	 * get all chanConnections of a user
	 * @param id the user's id
	 */
	@Get(":id/chan_connections")
	@UseGuards(IsUserGuard)
	getChanConnections(@Param("id") id: string): Promise<object> {
		return this.chanConnectionService.findByUser(id);
	}

	/**
	 * get all messages sent by a user
	 * @param id the user's id
	 */
	@Get(":id/messages")
	@UseGuards(IsUserGuard)
	getMessages(@Param("id") id: string): Promise<object> {
		return this.messageService.findByUser(id);
	}
}
