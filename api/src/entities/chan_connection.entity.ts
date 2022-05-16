import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Client } from "@entities/client.entity";
import { Channel } from "@entities/channel.entity";

@Entity()
export class ChanConnection {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Channel, (chan_id) => chan_id.id)
	chan_id: Channel;

	@ManyToOne(() => Client, (client_id) => client_id.id)
	client_id: Client;

	@Column()
	role: number;

	@Column()
	mute: boolean;

	@Column()
	date_end_mute: Date;
}
