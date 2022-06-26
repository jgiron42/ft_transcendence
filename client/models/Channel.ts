import { User } from "@/models/User";

export enum ChannelType {
	PUBLIC,
	PRIVATE,
	DM,
}

export class Channel {
	constructor(name: string = "", type: ChannelType = ChannelType.PUBLIC, owner: User | string = "") {
		this.name = name;
		this.type = type;
		this.owner = owner;
	}

	name: string;
	type: ChannelType;
	owner: User | string;
}
