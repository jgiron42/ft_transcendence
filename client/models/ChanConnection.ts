import { User } from "@/models/User";
import { Channel } from "@/models/Channel";

export class ChanConnection {
	constructor() {
		this.role = 0;
		this.muted = false;
		this.created_at = new Date();
	}

	id: number;
	channel: Channel;
	user: User;
	role: number;
	muted: boolean;
	mute_end: Date;
	created_at: Date;
}
