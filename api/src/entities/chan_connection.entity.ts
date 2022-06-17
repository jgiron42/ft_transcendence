import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Unique } from "typeorm";
import { User } from "@entities/user.entity";
import { Channel } from "@entities/channel.entity";
import { Expose } from "class-transformer";
import { SetMode } from "@utils/set-mode";
//    This entity is use in order to know who have access to which channel

@Entity()
@Expose() // class-transformer
@Unique("unique_connection", ["chan_id", "user_id"])
export class ChanConnection {
	constructor() {
		this.role = 0;
		this.mute = false;
	}

	@PrimaryGeneratedColumn()
	@SetMode("r")
	id: number;

	// Id of the channel
	@ManyToOne(() => Channel, (chan_id) => chan_id.id, { eager: true, onDelete: "CASCADE" })
	@SetMode("cru")
	chan_id: Channel;

	// Id of the user
	@ManyToOne(() => User, (user_id) => user_id.id, { eager: true, onDelete: "CASCADE" })
	@SetMode("cru")
	user_id: User;

	// role of the user in the channel
	@Column()
	@SetMode("cru")
	role: number;

	// use to know if the user is mute in the channel
	@Column()
	@SetMode("cru")
	mute: boolean;

	// date to know the end of the mute
	@Column({ nullable: true })
	@SetMode("cru")
	date_end_mute: Date;
}
