import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";
import { SetMode } from "@utils/set-mode";

// entity use to describe the channel

export enum ChannelType {
	PUBLIC,
	PASSWORD,
	PRIVATE,
	DM,
}

@Entity()
export class Channel {
	constructor() {
		this.type = ChannelType.PUBLIC;
		this.password = "";
	}
	@PrimaryGeneratedColumn()
	@SetMode("r")
	id: number;

	// name of the channel
	@Column({ unique: true })
	@SetMode("cru")
	name: string;

	// type of channel
	@Column({
		type: "enum",
		enum: ChannelType,
	})
	@SetMode("cru")
	type: ChannelType;

	// password to access to the channnel
	@Column()
	@SetMode("cu")
	password: string;

	// date of the message
	@CreateDateColumn()
	@SetMode("r")
	created_at: Date;
}
