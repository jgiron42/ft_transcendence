import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Unique, CreateDateColumn } from "typeorm";
import { User } from "@entities/user.entity";
import { Channel } from "@entities/channel.entity";
import { Expose } from "class-transformer";
import { SetMode } from "@utils/set-mode";
//    This entity is use in order to know who have access to which channel

export enum ChannelRole {
	BANNED,
	USER,
	ADMIN,
	OWNER,
}

@Entity()
@Expose() // class-transformer
@Unique("unique_connection", ["channel", "user"])
export class ChanConnection {
	@PrimaryGeneratedColumn()
	@SetMode("r")
	id: number;

	// Id of the channel
	@ManyToOne(() => Channel, (channel) => channel.id, { eager: true, onDelete: "CASCADE" })
	@SetMode("cru")
	channel: Channel;

	// Id of the user
	@ManyToOne(() => User, (user) => user.id, { eager: true, onDelete: "CASCADE" })
	@SetMode("cru")
	user: User;

	//  role of the user in the channel
	@Column({
		type: "enum",
		enum: ChannelRole,
		default: ChannelRole.USER,
	})
	@SetMode("cru")
	role: ChannelRole;

	// date to know the end of the mute
	@Column({ nullable: true, default: null })
	@SetMode("cru")
	mute_end: Date;

	// date of the message
	@CreateDateColumn()
	@SetMode("r")
	created_at: Date;
}
