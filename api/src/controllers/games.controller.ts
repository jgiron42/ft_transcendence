import {
	Controller,
	Get,
	Param,
	ParseIntPipe,
	Post,
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
import { Page } from "@utils/Page";
import { PerPage } from "@utils/PerPage";
import { TypeormErrorFilter } from "@filters/typeorm-error.filter";
import { User } from "@src/entities/user.entity";
import { ValidationError } from "@src/exceptions/validationError.exception";
import { PaginatedResponse } from "@src/types/paginated-response";
import { PaginationInterceptor } from "@interceptors/pagination.interceptor";
import { GetUser } from "@utils/get-user";

@Controller("games")
@UseGuards(...SessionGuard)
@UseInterceptors(CrudFilterInterceptor, PaginationInterceptor)
@UseFilters(TypeormErrorFilter)
export class GamesController {
	constructor(private gameService: GameService) {}

	/**
	 * get all games
	 */
	@Get()
	async getAll(@Page() page: number, @PerPage() per_page: number): Promise<PaginatedResponse<Game>> {
		return this.gameService.getQuery().paginate(page, per_page).getManyAndCount();
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
	 */
	@Post()
	@UsePipes(getValidationPipe(Game))
	create(@MyRequestPipe(...getPostPipeline(Game)) game: Game, @GetUser() user: User) {
		if ((game.user_one as User)?.id !== user.id && (game.user_two as User)?.id !== user.id)
			throw new ValidationError("user must be in game creation");
		return this.gameService.create(game);
	}
}
