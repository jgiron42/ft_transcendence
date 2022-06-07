import {
	ClassSerializerInterceptor,
	Controller,
	Get,
	Param,
	Post, SerializeOptions,
	UseGuards,
	UseInterceptors,
	UsePipes,
} from "@nestjs/common";
import { GameExistGuard } from "@src/guards/game-exist.guard";
import { GameService } from "@services/game.service";
// import { SessionGuard } from "@guards/session.guard";
import { Game } from "@entities/game.entity";
import { getValidationPipe } from "@utils/getValidationPipe";
import { RequestPipeDecorator } from "@utils/requestPipeDecorator";
import { getPostPipe } from "@utils/getPostPipe";

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
	@UsePipes(getValidationPipe(Game))
	async create(@RequestPipeDecorator(...getPostPipe(Game)) game: Game): Promise<object> {
		return this.gameService.create(game);
	}
}
