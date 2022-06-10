import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Channel } from "@entities/channel.entity";

// this entity exist to stock all the message

@Entity()
export class Message {
	@PrimaryGeneratedColumn()
	id: number;

	// content of the messsage
	@Column()
	content: string;

	// user who send the message
	// @ManyToOne(() => User, (send_by) => send_by.id)
	// send_by: User;
	@Column()
	send_by: string;

	// date of the message
	@Column()
	date: Date;

	// destination of the message
	@ManyToOne(() => Channel, (dest_channel) => dest_channel.id)
	dest_channel: Channel;

	constructor(content: string, send_by: string, dest_channel: Channel, date = new Date()) {
		this.content = content;
		this.send_by = send_by;
		this.dest_channel = dest_channel;
		this.date = date;
	}
}
