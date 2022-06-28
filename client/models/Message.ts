import { Channel } from "@/models/Channel";
import { User } from "@/models/User";

export class Message {
	constructor() {
		this.created_at = new Date();
	}

	id: number;
	user: User | string;
	channel: Channel | number;
	content: string;
	created_at: Date;
}
