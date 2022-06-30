import { User } from "@/models/User";

export enum ChannelType {
	PUBLIC,
	PRIVATE,
	DM,
}

export class Channel {
	id: number;
	name: string;
	type: ChannelType;
	owner: User | string;
}
