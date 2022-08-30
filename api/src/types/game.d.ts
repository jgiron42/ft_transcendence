import { User } from "@src/entities/user.entity";
import { AllowedGameMode } from "@src/config/game.config";
import { Game } from "@src/gamemodes/default";
import { Socket } from "socket.io";

export type UserID = string;
export type GameID = string;
export type InvitationID = string;

// Type: Pool storing all matches, regardless of their modes
export type MatchPool = Map<UserID, Match>;

// Type: Pool storing users, used as a matchmaking queue
export type GameUserSet = Set<GameUser>;

// Type: Pool storing users.
export type GameUserPool = Map<UserID, GameUser>;

// Type: Global pool containing all game modes pools
export type MatchmakingPool = Map<AllowedGameMode, GameUserSet>;

export interface GameInvitation {
	from: UserID;
	mode: AllowedGameMode;
}

export type InvitationMap = Map<InvitationID, GameInvitation>;

export interface GameScore {
	p1: number;
	p2: number;
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

type GameData = ReturnType<typeof Game.prototype.cloneData>;

export interface Match {
	p1: GameUser;
	p2: GameUser;
	status: "creating" | "ongoing" | "aborted" | "finished";
	type: "ManVsMachine" | "ManVsMan" | "MachineVsMachine";
	mode: AllowedGameMode;
	id: GameID;
	created_at: number;
	lastStatusUpdate: number;
	game: Game;
	sockets: Set<Socket>;
}

export interface GameUser {
	user: User;
	status: "connected" | "matchmaking" | "game" | "disconnected";
	type: "user" | "bot";
	lastSeenDate: number;
	searchStartDate: number;
	gameMode: AllowedGameMode;
	match: Match | null;
	gameEvents: { up: boolean; down: boolean };
	invitations: InvitationMap;
	sockets: Set<Socket>;
}

export type SerializedMatch = { id: GameID; p1: UserID; p2: UserID; mode: AllowedGameMode };
export interface UserMatchmakingStatus {
	user: User;
	status: "connected" | "matchmaking" | "game";
	searchDate: number;
	connectedPool: UserID[];
	matchMakingPools: Record<AllowedGameMode, UserID[]>;
	invitations: Record<keyof InvitationMap, InvitationMap[keyof InvitationMap]>;
	match: SerializedMatch;
	availableGameModes: AllowedGameMode[];
	matchList: SerializedMatch[];
}

export interface ClientMatch {
	p1: User;
	p2: User;
	status: "creating" | "ongoing" | "aborted" | "finished";
	type: "ManVsMachine" | "ManVsMan" | "MachineVsMachine";
	mode: AllowedGameMode;
	id: GameID;
	created_at: number;
	lastStatusUpdate: number;
	data: GameData;
}
