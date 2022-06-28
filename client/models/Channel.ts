import { User } from "@/models/User";

export enum ChannelType {
	PUBLIC,
	PRIVATE,
	DM,
}

export class Channel {
	constructor(name: string = "", type: ChannelType = ChannelType.PUBLIC, owner: User | string = "", id: number = 0) {
		this.id = id;
		this.name = name;
		this.type = type;
		this.owner = owner;
	}

	id: number;
	name: string;
	type: ChannelType;
	owner: User | string;
}
