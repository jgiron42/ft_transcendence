import { User } from "~/models/User";
import { Game } from "~/gamemodes/default";
export interface ClientMatch {
	p1: User;
	p2: User;
	status: "creating" | "ongoing" | "aborted" | "finished";
	type: "ManVsMachine" | "ManVsMan" | "MachineVsMachine";
	mode: string;
	id: string;
	created_at: number;
	lastStatusUpdate: number;
	data: ReturnType<typeof Game.prototype.cloneData>;
}
