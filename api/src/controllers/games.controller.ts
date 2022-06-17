import {
	Controller,
	Get,
	Param,
	ParseIntPipe,
	Post,
	Res,
	UseFilters,
	UseGuards,
	UseInterceptors,
	UsePipes,
} from "@nestjs/common";
import { GameService } from "@services/game.service";
import { Game } from "@entities/game.entity";
import { getValidationPipe } from "@utils/getValidationPipe";
import { getPostPipeline } from "@utils/getPostPipeline";
import { MyRequestPipe } from "@utils/myRequestPipe";
import { CrudFilterInterceptor } from "@interceptors/crud-filter.interceptor";
import { SessionGuard } from "@guards/session.guard";
import { Response } from "express";
import { Page } from "@utils/Page";
import { PerPage } from "@utils/PerPage";
import { QueryFailedFilter } from "@filters/query-failed.filter";
import { EntityNotFoundFilter } from "@filters/entity-not-found.filter";

@Controller("games")
@UseGuards(...SessionGuard)
@UseInterceptors(CrudFilterInterceptor)
@UseFilters(QueryFailedFilter, EntityNotFoundFilter)
export class GamesController {
	constructor(private gameService: GameService) {}

	/**
	 * get all games
	 */
	@Get()
	async getAll(
		@Page() page: number,
		@PerPage() per_page: number,
		@Res({ passthrough: true }) res: Response,
	): Promise<object> {
		const [ret, total] = await this.gameService.getQuery().paginate(page, per_page).getManyAndCount();
		res.setHeader("total_entities", total);
		res.setHeader("total_pages", Math.ceil(total / per_page));
		return ret;
	}

	/**
	 * get the game designated by id
	 * @param id the game id
	 */
	@Get(":id")
	getOne(@Param("id", ParseIntPipe) id: number): Promise<object> {
		return this.gameService.getQuery().getOne(id);
	}

	/**
	 * create a new Game
	 * @param game the json object game
	 */
	@Post()
	@UsePipes(getValidationPipe(Game))
	create(@MyRequestPipe(...getPostPipeline(Game)) game: Game) {
		// TODO: protect
		return this.gameService.create(game);
	}
}
