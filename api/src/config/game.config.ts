import * as fs from "fs";

const IMPLEMENTED_GAME_MODES = ["regular", "hardcore", "flappy"] as const;
type ImplementedGameMode = typeof IMPLEMENTED_GAME_MODES[number];

// Read the config file at runtime.
// Get config file path.
const configPath = process.env.GAME_CONFIG || "./config.json";

// Read the config file.
const parsedConfig = JSON.parse(fs.readFileSync(configPath, "utf8")) as {
	gameModes: ImplementedGameMode[];
	maxGameDuration: number;
	maxDisconnectDuration: number;
};

// https://steveholgado.com/typescript-types-from-arrays/

const config = {
	...parsedConfig,
	implementedGameModes: IMPLEMENTED_GAME_MODES,
};
type AllowedGameMode = typeof config.gameModes[number];

export default config;

export type { ImplementedGameMode, AllowedGameMode };
