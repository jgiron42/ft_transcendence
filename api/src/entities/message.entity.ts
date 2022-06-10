import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Channel } from "@entities/channel.entity";
import { setService } from "@utils/setFinalType.decorator";
import { UserService } from "@services/user.service";
import { SetMode } from "@utils/set-mode";
import { User } from "./user.entity";

// this entity exist to stock all the message

@Entity()
export class Message {
	cosntructor() {
		this.date = new Date();
	}
	@PrimaryGeneratedColumn()
	@SetMode("r")
	id: number;

	// content of the messsage
	@Column()
	@SetMode("cru")
	content: string;

	// user who send the message
	@ManyToOne(() => User, (send_by) => send_by.id)
	@SetMode("r")
	@setService(UserService)
	send_by: User | string;

	// date of the message
	@Column()
	@SetMode("r")
	date: Date;

	// destination of the message
	@ManyToOne(() => Channel, (dest_channel) => dest_channel.id)
	@SetMode("cru")
	dest_channel: Channel | number;
}
