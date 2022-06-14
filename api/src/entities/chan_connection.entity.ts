import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "@entities/user.entity";
import { Channel } from "@entities/channel.entity";

//    This entity is use in order to know who have access to which channel

@Entity()
export class ChanConnection {
	@PrimaryGeneratedColumn()
	id: number;

	// Id of the user
	@ManyToOne(() => User, (user_id) => user_id.id)
	user: User;

	// Id of the channel
	@ManyToOne(() => Channel, (chan_id) => chan_id.id)
	channel: Channel;

	// role of the user in the channel
	@Column()
	role: number;

	// use to know if the user is mute in the channel
	@Column()
	muted: boolean;

	// date to know the end of the mute
	@Column()
	mute_end: Date;

	// date of the message
	@Column()
	created_at: Date;
}
