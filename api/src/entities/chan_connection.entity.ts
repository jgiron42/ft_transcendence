import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "@entities/user.entity";
import { Channel } from "@entities/channel.entity";
import { Expose } from "class-transformer";
import { SetMode } from "@utils/set-mode";

//    This entity is use in order to know who have access to which channel

@Entity()
@Expose() // class-transformer
export class ChanConnection {
	@PrimaryGeneratedColumn()
	@SetMode("r")
	id: number;

	// Id of the channel
	@ManyToOne(() => Channel, (chan_id) => chan_id.id)
	@SetMode("cu")
	chan_id: Channel;

	// Id of the user
	@ManyToOne(() => User, (user_id) => user_id.id)
	@SetMode("cru")
	user_id: User;

	// role of the user in the channel
	@Column()
	@SetMode("r")
	role: number;

	// use to know if the user is mute in the channel
	@Column()
	@SetMode("r")
	mute: boolean;

	// date to know the end of the mute
	@Column()
	@SetMode("r")
	date_end_mute: Date;
}
