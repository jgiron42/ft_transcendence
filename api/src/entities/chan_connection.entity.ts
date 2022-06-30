import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Unique } from "typeorm";
import { User } from "@entities/user.entity";
import { Channel } from "@entities/channel.entity";
import { Expose } from "class-transformer";
import { SetMode } from "@utils/set-mode";
//    This entity is use in order to know who have access to which channel

@Entity()
@Expose() // class-transformer
@Unique("unique_connection", ["channel", "user"])
export class ChanConnection {
	constructor() {
		this.role = 0;
		this.muted = false;
		this.created_at = new Date();
	}

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

	// role of the user in the channel
	@Column()
	@SetMode("cru")
	role: number;

	// use to know if the user is mute in the channel
	@Column()
	@SetMode("cru")
	muted: boolean;

	// date to know the end of the mute
	@Column({ nullable: true })
	@SetMode("cru")
	mute_end: Date;

	// date of the message
	@Column()
	created_at: Date;
}
