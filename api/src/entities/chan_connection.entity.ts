import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "@entities/user.entity";
import { Channel } from "@entities/channel.entity";

@Entity()
export class ChanConnection {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Channel, (chan_id) => chan_id.id)
	chan_id: Channel;

	@ManyToOne(() => User, (user_id) => user_id.id)
	user_id: User;

	@Column()
	role: number;

	@Column()
	mute: boolean;

	@Column()
	date_end_mute: Date;
}
