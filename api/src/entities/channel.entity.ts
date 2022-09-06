import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Check } from "typeorm";
import { SetMode } from "@utils/set-mode";
import { config as userConfig } from "@config/user.config";
import { config as channelConfig } from "@config/channel.config";
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
	@Length(channelConfig.nameMinLength, channelConfig.nameMaxLength)
	@Check(
		`LENGTH(name) >= ${channelConfig.nameMinLength} AND LENGTH(name) <= ${Math.max(
			userConfig.usernameMaxLength * 2 + 3, // minimum length for dm channels
			channelConfig.nameMinLength,
		)}`,
	)
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
