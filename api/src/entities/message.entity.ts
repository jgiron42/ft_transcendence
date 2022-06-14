import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Channel } from "@entities/channel.entity";
import { User } from "./user.entity";

// this entity exist to stock all the message

@Entity()
export class Message {
	@PrimaryGeneratedColumn()
	id: number;

	// user who send the message
	@ManyToOne(() => User, (send_by) => send_by.id)
	user: User;

	// destination of the message
	@ManyToOne(() => Channel, (dest_channel) => dest_channel.id)
	channel: Channel;

	// content of the messsage
	@Column()
	content: string;

	// date of the message
	@Column()
	created_at: Date;
}
