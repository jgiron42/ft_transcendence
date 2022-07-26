import { User } from "@src/entities/user.entity";
import { AllowedGameMode } from "@src/config/game.config";

// Type: Pool storing all matches, regardless of their modes
export type MatchPool = Map<string, Match>;

// Type: Pool storing users, used as a matchmaking queue
export type GameUserSet = Set<GameUser>;

// Type: Pool storing users.
export type GameUserPool = Map<string, GameUser>;

// Type: Global pool containing all game modes pools
export type MatchmakingPool = Map<AllowedGameMode, GameUserSet>;

export interface GameScore {
	user1: number;
	user2: number;
}

export interface PongBar {
	x: number;
	y: number;
	width: number;
	height: number;
}

export interface PongBall {
	x: number;
	y: number;
	radius: number;
	speed: { x: number; y: number };
}

export interface UserEvents {
	keys: string[];
}

export interface GameData {
	score: GameScore;
	objects: {
		barLeft: PongBar;
		barRight: PongBar;
		ball: PongBall;
	};
	events: {
		user1: UserEvents;
		user2: UserEvents;
	};
}

export interface Match {
	user1: GameUser;
	user2: GameUser;
	status: "creating" | "ongoing" | "aborted" | "finished";
	type: "ManVsMachine" | "ManVsMan" | "MachineVsMachine";
	mode: AllowedGameMode;
	id: string;
	created_at: number;
	lastStatusUpdate: number;
	data: GameData;
}

export interface GameUser {
	user: User;
	status: "connected" | "matchmaking" | "game" | "disconnected";
	type: "user" | "bot";
	lastSeenDate: number;
	searchStartDate: number;
	gameMode: AllowedGameMode;
	match: Match | null;
	sockets: Set<Socket>;
}
export interface UserMatchmakingStatus {
	user: User;
	status: "connected" | "matchmaking" | "game";
	searchDate: number;
	connectedPool: string[];
	matchMakingPools: Record<AllowedGameMode, string[]>;
	match: { id: string; self: string; oppponent: string };
	availableGameModes: string[];
}

export interface ClientMatch {
	self: User;
	opponent: User;
	status: "creating" | "ongoing" | "aborted" | "finished";
	type: "ManVsMachine" | "ManVsMan" | "MachineVsMachine";
	mode: AllowedGameMode;
	id: string;
	created_at: number;
	lastStatusUpdate: number;
	data: GameData;
}
