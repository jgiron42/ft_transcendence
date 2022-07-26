import { IsIn } from "class-validator";
import config, { ImplementedGameMode } from "@src/config/game.config";

export class GameModeDTO {
	@IsIn(config.gameModes)
	mode: ImplementedGameMode;
}
