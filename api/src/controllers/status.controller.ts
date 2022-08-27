import { Controller, Get, HttpException, Param, UseFilters, UseGuards } from "@nestjs/common";
import { SessionGuard } from "@guards/session.guard";
import { TypeormErrorFilter } from "@filters/typeorm-error.filter";
import { GameService } from "@src/services/game.service";

@Controller("status")
@UseGuards(...SessionGuard)
@UseFilters(TypeormErrorFilter)
export class StatusController {
	constructor(private gameService: GameService) {}
	/**
	 * Get the user's status
	 * @param id | User's ID
	 */
	@Get(":id")
	getOne(@Param("id") id: string): ReturnType<typeof GameService.prototype.getGameUser> {
		const status = this.gameService.getGameUser(id);

		// Throw 404 when user isn't connected or doesn't exist.
		if (!status) throw new HttpException("User was not found", 404);

		return status;
	}
}
