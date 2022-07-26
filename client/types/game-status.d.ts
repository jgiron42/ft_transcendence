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
