import { User } from "@/models/User";
import { Channel } from "@/models/Channel";

export enum ChannelRole {
	BANNED,
	USER,
	ADMIN,
	OWNER,
}

export class ChanConnection {
	constructor() {
		this.role = 0;
		this.created_at = new Date();
		this.channel = new Channel();
	}

	id: number;
	channel: Channel;
	user: User;
	role: ChannelRole;
	mute_end: Date;
	created_at: Date;
}
