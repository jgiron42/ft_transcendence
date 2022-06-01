import {
	Body,
	ClassSerializerInterceptor,
	Controller,
	Get,
	Param,
	Post, SerializeOptions,
	UseGuards,
	UseInterceptors,
	UsePipes,
	ValidationPipe,
} from "@nestjs/common";
import { GameExistGuard } from "@src/guards/game-exist.guard";
import { GameService } from "@services/game.service";
// import { SessionGuard } from "@guards/session.guard";
import { CreateGamePipe } from "@pipes/create-game.pipe";
import { Game } from "@entities/game.entity";
import {DefaultPipe} from "@pipes/default.pipe";

@Controller("games")
// @UseGuards(...SessionGuard)
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({
})
export class GamesController {
	constructor(private gameService: GameService) {}
	@Get()
	getAll(): Promise<object> {
		return this.gameService.findAll();
	}

	@Get(":id")
	@UseGuards(GameExistGuard)
	getOne(@Param("id") id: string): Promise<object> {
		return this.gameService.findOne(id);
	}

	@Post()
	@UsePipes(new ValidationPipe({ whitelist: true , transform: true, expectedType: Game, transformOptions: {	excludeExtraneousValues: true, exposeUnsetFields: false}}), new DefaultPipe(new Game), CreateGamePipe)
	async create(@Body() game: Game): Promise<object> {
		return this.gameService.create(game);
	}
}
