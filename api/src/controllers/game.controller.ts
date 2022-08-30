import {
	Body,
	Controller,
	Delete,
	Get,
	HttpException,
	Param,
	Post,
	Put,
	Req,
	UseFilters,
	UseGuards,
	ValidationPipe,
	ValidationPipeOptions,
} from "@nestjs/common";
import { SessionGuard } from "@guards/session.guard";
import { TypeormErrorFilter } from "@filters/typeorm-error.filter";
import { GameService } from "@src/services/game.service";
import { GameID, InvitationID } from "@src/types/game";
import { Request } from "@src/types/request";
import { GameInviteDTO } from "@src/types/dtos/GameInvite.dto";
import config from "@src/config/game.config";

const exceptionOptions: ValidationPipeOptions = {
	exceptionFactory: (errors) => {
		return new HttpException(errors.flatMap((err) => Object.values(err.constraints)).join(", "), 400);
	},
};

@Controller("game")
@UseGuards(...SessionGuard)
@UseFilters(TypeormErrorFilter)
export class GameController {
	constructor(private gameService: GameService) {}

	/**
	 * Accept the given game invitation
	 * @param id | Invitations's ID (hash)
	 */
	@Put("invite/:id")
	async acceptInvite(@Req() req: Request, @Param("id") invitationID: InvitationID): Promise<GameID> {
		const status = await this.gameService.acceptGameInvite(req.user.id, invitationID);

		// Throw 404 when user isn't connected or doesn't exist.
		if (!status) throw new HttpException("Invitation not found", 404);

		return status.id;
	}

	/**
	 * Get the user's status
	 * @body to | recpient's ID
	 * @body mode | selected game mode.
	 */
	@Post("invite")
	sendInvite(@Req() req: Request, @Body("", new ValidationPipe(exceptionOptions)) data: GameInviteDTO): string {
		// Extract sender's ID.
		const from = req.user.id;

		// Create the invitation and store it in the recipient.
		const result = this.gameService.addGameInvite(from, data.to, data.mode);

		// Handle case where recipient isn't connected anymore or the payload was invalid.
		if (!result) throw new HttpException("Could not create game invite.", 400);

		// Return the invite's hash.
		return result;
	}

	/**
	 * Delete the given invitation
	 * @param id | Invitation ID (hash)
	 */
	@Delete("invite/:id")
	declineInvite(@Req() req: Request, @Param("id") invitationID: InvitationID): boolean {
		// Remove the game invite from recipient's list.
		return this.gameService.removeGameInvite(req.user.id, invitationID);
	}

	/**
	 * Get allowed game modes.
	 */
	@Get("/modes")
	getGamemodes() {
		// Return configured game modes.
		return config.gameModes;
	}
}
