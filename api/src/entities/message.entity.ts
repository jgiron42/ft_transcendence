import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Channel } from "@entities/channel.entity";
import { User } from "./user.entity";

@Entity()
export class Message {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	content: string;

	@ManyToOne(() => User, (send_by) => send_by.id)
	send_by: User;

	@Column()
	date: Date;

	@ManyToOne(() => Channel, (dest_channel) => dest_channel.id)
	dest_channel: Channel;
}
