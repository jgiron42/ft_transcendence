import { User } from "@/models/User";

export type SerializedMatch = { id: string; p1: string; p2: string; mode: string };
export interface UserMatchmakingStatus {
	user: User;
	status: "connected" | "matchmaking" | "game";
	searchDate: number;
	connectedPool: string[];
	matchMakingPools: Record<string, string[]>;
	match: SerializedMatch;
	availableGameModes: string[];
	matchList: SerializedMatch[];
}
