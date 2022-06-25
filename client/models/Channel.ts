import { User } from "@/models/User";

export class Channel {
	id: number;
	name: string;
	chat_type: number;
	mdp: string;
	owner: User;
}
