import { Channel } from "@/models/Channel";
import { User } from "@/models/User";

export class ChanInvitation {
	id: number;

	user: User;
	invited_by: User;
	channel: Channel;
	created_at: Date;
}
