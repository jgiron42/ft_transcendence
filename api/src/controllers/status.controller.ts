import { Controller, Get, HttpException, Param, Req, UseFilters, UseGuards } from "@nestjs/common";
import { SessionGuard } from "@guards/session.guard";
import { TypeormErrorFilter } from "@filters/typeorm-error.filter";
import { GameService } from "@src/services/game.service";
import { Request } from "@src/types/request";

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
	getOne(@Req() req: Request, @Param("id") id: string): ReturnType<typeof GameService.prototype.getUserStatus> {
		const status = this.gameService.getUserStatus(id);

		// Throw 404 when user isn't connected or doesn't exist.
		if (!status) throw new HttpException("User not found", 404);

		// Show invitations only to the owner.
		return req.user.id === id ? status : { ...status, invitations: [] };
	}
}
