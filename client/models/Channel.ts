import { StringifiableModel } from "./StringifiableModel";

export enum ChannelType {
	PUBLIC,
	PASSWORD,
	PRIVATE,
	DM,
}

export class Channel extends StringifiableModel {
	id: number;
	name: string;
	type: ChannelType;
	password: string;
}
