import { Channel } from "@/models/Channel";

export class Message {
	id: number;
	content: string;
	send_by: string;
	date: Date;
	dest_channel: Channel;
}
