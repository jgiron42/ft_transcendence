import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Check } from "typeorm";
import { SetMode } from "@utils/set-mode";
import { Length } from "class-validator";

// entity use to describe the channel

export enum ChannelType {
	PUBLIC,
	PASSWORD,
	PRIVATE,
	DM,
}

@Entity()
export class Channel {
	@PrimaryGeneratedColumn()
	@SetMode("r")
	id: number;

	// name of the channel
	@Length(2, 10)
	@Check("LENGTH(name) > 2 AND LENGTH(name) < 10")
	@Column({ unique: true })
	@SetMode("cru")
	name: string;

	// type of channel
	@Column({
		type: "enum",
		enum: ChannelType,
		default: ChannelType.PUBLIC,
	})
	@SetMode("cru")
	type: ChannelType;

	// password to access to the channnel
	@Column({ default: "" })
	@SetMode("cu")
	password: string;

	// date of the message
	@CreateDateColumn()
	@SetMode("r")
	created_at: Date;
}
