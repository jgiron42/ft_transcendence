import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Channel } from "@entities/channel.entity";
import { setService } from "@utils/setFinalType.decorator";
import { UserService } from "@services/user.service";
import { SetMode } from "@utils/set-mode";
import { User } from "./user.entity";

// this entity exist to stock all the message

@Entity()
export class Message {
	constructor() {
		this.created_at = new Date();
	}
	@PrimaryGeneratedColumn()
	@SetMode("r")
	id: number;

	// user who send the message
	@ManyToOne(() => User, (send_by) => send_by.id, { eager: true, onDelete: "CASCADE" })
	@SetMode("r")
	@setService(UserService)
	user: User | string;

	// destination of the message
	@ManyToOne(() => Channel, (dest_channel) => dest_channel.id, { eager: true, onDelete: "CASCADE" })
	@SetMode("ru")
	channel: Channel | number;

	// content of the messsage
	@Column()
	@SetMode("cru")
	content: string;

	// date of the message
	@Column()
	@SetMode("r")
	created_at: Date;
}
