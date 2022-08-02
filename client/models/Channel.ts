export enum ChannelType {
	PUBLIC,
	PASSWORD,
	PRIVATE,
	DM,
}

export class Channel {
	id: number;
	name: string;
	type: ChannelType;
	password: string;
}
