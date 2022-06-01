import { Body, Controller, Get, Param, Put, UseGuards, Session, Post } from "@nestjs/common";
import { IsUserGuard } from "@guards/is-user.guard";
import { UserService } from "@services/user.service";
import { SessionT } from "@src/types/session";
// import { SessionGuard } from "@guards/session.guard";
import { DevelopmentGuard } from "@src/guards/development.guard";
import { UserCreation } from "@dtos/userCreation.dto";
import { GameService } from "@services/game.service";
import { RelationService } from "@services/relation.service";
import { MessageService } from "@services/message.service";
import { ChanConnectionService } from "@services/chan_connection.service";
import { User } from "@entities/user.entity";
import { EditResourcePipe } from "@pipes/edit-resource-pipe.service";
import { RequestPipeDecorator } from "@src/utils/requestPipeDecorator";
import { instanceToInstance} from "class-transformer";

@Controller("users")
// @UseGuards(...SessionGuard)
export class UsersController {
	constructor(
		private userService: UserService,
		private gameService: GameService,
		private relationService: RelationService,
		private messageService: MessageService,
		private chanConnectionService: ChanConnectionService,
	) {}
	@Get()
	getAll(): Promise<object> {
		return this.userService.findAll();
	}

	@Get(":id")
	@UseGuards()
	async getOne(@Param("id") id: string, @Session() ses: SessionT): Promise<User> {
		if (ses.user && id === ses.user.id)
			return instanceToInstance(await this.userService.findOne(id), {groups:['private']})
		return instanceToInstance(await this.userService.findOne(id))
	}

	@Put(":id")
	@UseGuards(IsUserGuard)
	update(@RequestPipeDecorator(new EditResourcePipe(User, UserService)) user: User): Promise<object> {
		return this.userService.create(user);
	}

	@Post()
	@UseGuards(DevelopmentGuard)
	create(@Body() user: UserCreation): Promise<object> {
		return this.userService.create(user);
	}

	@Get(":id/games")
	@UseGuards()
	getGames(@Param("id") id: string): Promise<object> {
		return this.gameService.findByUser(id);
	}

	@Get(":id/relations")
	@UseGuards(IsUserGuard)
	getRelations(@Param("id") id: string): Promise<object> {
		return this.relationService.findByUser(id);
	}

	@Get(":id/chan_connections")
	@UseGuards(IsUserGuard)
	getChanConnections(@Param("id") id: string): Promise<object> {
		return this.chanConnectionService.findByUser(id);
	}

	@Get(":id/messages")
	@UseGuards(IsUserGuard)
	getMessages(@Param("id") id: string): Promise<object> {
		return this.messageService.findByUser(id);
	}
}
