import { existsSync } from "fs";
import { join } from "path";
import {
	BadRequestException,
	Controller,
	Get,
	Param,
	Post,
	Put,
	Query,
	Req,
	Res,
	UseFilters,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import { UserService } from "@services/user.service";
import { DevelopmentGuard } from "@src/guards/development.guard";
import { StoredGameService } from "@services/stored-game.service";
import { RelationService } from "@services/relation.service";
import { MessageService } from "@services/message.service";
import { ChanConnectionService } from "@services/chan_connection.service";
import { User } from "@entities/user.entity";
import { MyRequestPipe } from "@utils/myRequestPipe";
import { getPutPipeline } from "@utils/getPutPipeline";
import { getPostPipeline } from "@utils/getPostPipeline";
import { CrudFilterInterceptor } from "@interceptors/crud-filter.interceptor";
import { SessionGuard } from "@guards/session.guard";
import { Request as MyRequest, Request } from "@src/types/request";
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
import { GetUser } from "@utils/get-user";
import { FilesInterceptor } from "@nestjs/platform-express";
import multer from "multer";
import config from "@config/api.config";
import { Response } from "express";
import { Magic, MAGIC_MIME_TYPE } from "mmmagic";
import { ValidationError } from "@src/exceptions/validationError.exception";

@Controller("users")
@UseGuards(...SessionGuard)
@UseInterceptors(CrudFilterInterceptor, PaginationInterceptor)
@SetGroupMappers({
	own_user: (req: MyRequest<User>) => req.params?.id && req.session.user?.id === req.params?.id,
})
@UseFilters(TypeormErrorFilter)
export class UsersController {
	constructor(
		private channelService: ChannelService,
		private userService: UserService,
		private gameService: StoredGameService,
		private relationService: RelationService,
		private messageService: MessageService,
		private chanConnectionService: ChanConnectionService,
	) {}

	/**
	 * get all visible users
	 */
	@Get()
	getAll(
		@Page() page: number,
		@PerPage() per_page: number,
		@Query("sort") sort = "created_at",
	): Promise<PaginatedResponse<User>> {
		if (sort !== "created_at" && sort !== "elo") throw new ValidationError("sort must be created_at or elo");
		return this.userService.getQuery().paginate(page, per_page).sort(`user.${sort}`, "DESC").getManyAndCount();
	}

	@Get("complete/:query")
	complete(@Param("query") query: string): Promise<User[]> {
		return this.userService.complete(query);
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
	async update(
		@Param("id") id: string,
		@MyRequestPipe(...getPutPipeline(User)) user: User,
		@GetUser() requestUser: User,
	) {
		user.initialized = true;
		return await this.userService.getQuery().is(requestUser.id).updateWithSave(user, id);
	}

	/**
	 * create a user
	 * @Warning only works in development
	 * @param user
	 */
	@Post()
	@UseGuards(DevelopmentGuard)
	create(@MyRequestPipe(...getPostPipeline(User)) user: User): Promise<User> {
		return this.userService.create(user);
	}

	@Post(":id/invite_friend")
	async inviteFriend(@Param("id") id: string, @GetUser() user: User): Promise<object> {
		if (
			await this.relationService
				.getQuery()
				.in_relation(id)
				.in_relation(user.id)
				.type(RelationType.FRIEND)
				.getOne()
		)
			throw new BadRequestException("Friendship already exists");
		return this.relationService
			.getQuery()
			.findOrCreate({ type: RelationType.FRIEND_REQUEST, owner: { id: user.id }, target: { id } });
	}

	@Post(":id/block")
	block(@Param("id") id: string, @GetUser() user: User): Promise<object> {
		return this.relationService
			.getQuery()
			.findOrCreate({ type: RelationType.BLOCK, owner: { id: user.id }, target: { id } });
	}

	/**
	 * get all games of an user
	 */
	@Get(":id/dm")
	async dm(@Param("id") id: string, @GetUser() user: User): Promise<Channel> {
		let chan = await this.channelService
			.getQuery()
			.on_channel(id)
			.on_channel(user.id)
			.type(ChannelType.DM)
			.getOne();
		// if the chan does not exist yet, create it and put the users in it
		if (!chan) {
			chan = await this.channelService.getQuery().create({ type: ChannelType.DM, name: `${user.id} - ${id}` });
			await this.chanConnectionService.getQuery().create({ channel: chan, user: { id: user.id } });
			await this.chanConnectionService.getQuery().create({ channel: chan, user: { id } });
		}
		return chan;
	}

	/**
	 * get all games of a user
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
		@GetUser() user: User,
		@Page() page: number,
		@PerPage() per_page: number,
	): Promise<PaginatedResponse<Relation>> {
		return this.relationService
			.getQuery()
			.in_relation(user.id)
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
		@GetUser() user: User,
		@Page() page: number,
		@PerPage() per_page: number,
	): Promise<PaginatedResponse<ChanConnection>> {
		return this.chanConnectionService
			.getQuery()
			.see_connection(user.id)
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
		@GetUser() user: User,
		@Page() page: number,
		@PerPage() per_page: number,
	): Promise<PaginatedResponse<Message>> {
		return this.messageService.getQuery().see_message(user.id).user(id).paginate(page, per_page).getManyAndCount();
	}

	/**
	 * upload a profile picture
	 */
	@Post("picture")
	@UseInterceptors(
		FilesInterceptor("file", undefined, {
			storage: multer.diskStorage({
				destination: (_req, _file, cb) => {
					cb(null, config.uploadsPath);
				},
				filename: (req: MyRequest, _file, cb) => {
					cb(null, req.session.user.id);
				},
			}),
			limits: {
				fileSize: config.maxAvatarSize,
				files: 1,
			},
			fileFilter: (
				_req: any,
				file: {
					fieldname: string;
					originalname: string;
					encoding: string;
					mimetype: string;
					size: number;
					destination: string;
					filename: string;
					path: string;
					buffer: Buffer;
				},
				callback: (error: Error | null, acceptFile: boolean) => void,
			) => {
				if (file.mimetype !== "image/png" && file.mimetype !== "image/jpeg")
					return callback(new BadRequestException("Only png and jpeg images are allowed"), false);
				callback(null, true);
			},
		}),
	)
	uploadProfilePicture(@Req() req: Request): User {
		return req.user;
	}

	@Get(":id/picture")
	getImage(@Param("id") id: string, @Res() res: Response) {
		if (!existsSync(join(config.uploadsPath, id))) {
			if (config.defaultAvatar) res.redirect(config.defaultAvatar);
			else res.sendStatus(404);
			return;
		} else
			new Magic(MAGIC_MIME_TYPE).detectFile(
				join(config.uploadsPath, id),
				(_err: Error, mime: string | string[]) => {
					if (mime === "image/png" || mime === "image/jpeg") {
						res.sendFile(join(config.uploadsPath, id), { headers: { "Content-Type": mime } });
					} else
						res.status(404).send(
							"This is a ft_transcendence not a darkly you little fucker (last part was from copilot not me)",
						);
				},
			);
	}
}
