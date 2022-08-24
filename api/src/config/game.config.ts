import * as fs from "fs";

const IMPLEMENTED_GAME_MODES = ["default", "horizontal", "big", "inverse"] as const;
type ImplementedGameMode = typeof IMPLEMENTED_GAME_MODES[number];

// Read the config file at runtime.
// Get config file path.
const configPath = process.env.GAME_CONFIG || "./config.json";

// Read the config file.
const parsedConfig = JSON.parse(fs.readFileSync(configPath, "utf8")) as {
	// Allowed gamemodes list.
	gameModes: ImplementedGameMode[];

	// Time a game is allowed to last before being aborted
	maxGameDuration: number;

	// Time an user is allowed to be disconnected before being cleaned up from pools
	// and ongoing games.
	maxDisconnectDuration: number;

	// Time to wait between a match creation and the game start.
	timeBeforeGameStart: number;

	// The ELO rating users have when they are first created.
	baseELO: number;

	// The ELO rating bots have when they're first created.
	botBaseELO: number;

	// The time interval at which matchmaking periodically logs stuff
	logInterval: number;

	// The interval at which the job responsible for matching users is ran.
	matchingJobInterval: number;

	// The interval at which matchmaking updates are sent to clients.
	matchmakingSendUpdatesInterval: number;

	// The interval at which the job responsible for cleaning disconnected users is ran.
	cleanDisconnetedUsersInterval: number;

	// The interval at which the games states are updated (should probably always be 0)
	gameUpdatesInterval: number;

	// Time to wait before cleaning finished/aborted game (to let clients acknowledge it)
	timeBeforeCleaningEndedGame: number;
};

// https://steveholgado.com/typescript-types-from-arrays/

const config = {
	...parsedConfig,
	implementedGameModes: IMPLEMENTED_GAME_MODES,
};

type AllowedGameMode = typeof config.gameModes[number];

export default config;

export type { ImplementedGameMode, AllowedGameMode };
