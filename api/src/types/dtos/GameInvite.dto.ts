import { IsIn, IsString } from "class-validator";
import config, { AllowedGameMode } from "@src/config/game.config";

export class GameInviteDTO {
	@IsString()
	to: string;

	@IsIn(config.gameModes)
	mode: AllowedGameMode;
}
