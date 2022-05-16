import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Client } from "@entities/client.entity";
import { Channel } from "@entities/channel.entity";

@Entity()
export class Message {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	content: string;

	@ManyToOne(() => Client, (send_by) => send_by.id)
	send_by: Client;

	@Column()
	date: Date;

	@ManyToOne(() => Channel, (dest_channel) => dest_channel.id)
	dest_channel: Channel;
}
