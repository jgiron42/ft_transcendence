import { Controller, Get, Param, Post, UseGuards, UseInterceptors, UsePipes } from "@nestjs/common";
import { GameExistGuard } from "@src/guards/game-exist.guard";
import { GameService } from "@services/game.service";
import { Game } from "@entities/game.entity";
import { getValidationPipe } from "@utils/getValidationPipe";
import { getPostPipeline } from "@utils/getPostPipeline";
import { RequestPipeDecorator } from "@utils/requestPipeDecorator";
import { CrudFilterInterceptor } from "@interceptors/crud-filter.interceptor";
// import { SessionGuard } from "@guards/session.guard";

@Controller("games")
// @UseGuards(...SessionGuard)
@UseInterceptors(CrudFilterInterceptor)
export class GamesController {
	constructor(private gameService: GameService) {}

	/**
	 * get all games
	 */
	@Get()
	getAll(): Promise<object> {
		return this.gameService.findAll();
	}

	/**
	 * get the game designated by id
	 * @param id the game id
	 */
	@Get(":id")
	@UseGuards(GameExistGuard)
	getOne(@Param("id") id: string): Promise<object> {
		return this.gameService.findOne(id);
	}

	/**
	 * create a new Game
	 * @param game the json object game
	 */
	@Post()
	@UsePipes(getValidationPipe(Game))
	async create(@RequestPipeDecorator(...getPostPipeline(Game)) game: Game): Promise<object> {
		return this.gameService.create(game);
	}
}
