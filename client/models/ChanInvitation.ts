import { StringifiableModel } from "./StringifiableModel";
import { Channel } from "@/models/Channel";
import { User } from "@/models/User";

export class ChanInvitation extends StringifiableModel {
	id: number;

	user: User;
	invited_by: User;
	channel: Channel;
	created_at: Date;
}
