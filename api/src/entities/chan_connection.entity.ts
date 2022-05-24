import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "@entities/user.entity";
import { Channel } from "@entities/channel.entity";

//    This entity is use in order to know who have access to which channel

@Entity()
export class ChanConnection {
	@PrimaryGeneratedColumn()
	id: number;

	// Id of the channel
	@ManyToOne(() => Channel, (chan_id) => chan_id.id)
	chan_id: Channel;

	// Id of the user
	@ManyToOne(() => User, (user_id) => user_id.id)
	user_id: User;

	// role of the user in the channel
	@Column()
	role: number;

	// use to know if the user is mute in the channel
	@Column()
	mute: boolean;

	// date to know the end of the mute
	@Column()
	date_end_mute: Date;
}
