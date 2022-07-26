import { User } from "@/models/User";

export interface UserMatchmakingStatus {
	user: User;
	status: "connected" | "matchmaking" | "game";
	searchDate: number;
	connectedPool: string[];
	matchMakingPools: Record<string, string[]>;
	match: { id: string; self: string; oppponent: string };
	availableGameModes: string[];
}
