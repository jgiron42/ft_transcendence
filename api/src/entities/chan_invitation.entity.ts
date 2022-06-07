import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Channel } from "@entities/channel.entity";
import { setService } from "@utils/setFinalType.decorator";
import { UserService } from "@services/user.service";
import { ChannelService } from "@services/channel.service";
import { SetMode } from "@utils/set-mode";
import { Exclude } from "class-transformer";
import { User } from "./user.entity";

// entity use to manage the channel invitation

@Entity()
@Exclude()
export class ChanInvitation {
	constructor() {
		this.date = new Date();
	}
	@PrimaryGeneratedColumn()
	@SetMode("r")
	id: number;

	// date of invitation
	@Column()
	@SetMode("r")
	date: Date;

	// who invite a user to join a channel
	@ManyToOne(() => User, (invite_by) => invite_by.id)
	@setService(UserService)
	@SetMode("r")
	invite_by: User;

	// who is invited to join the channel
	@ManyToOne(() => User, (invited) => invited.id)
	@setService(UserService)
	@SetMode("rw")
	invited: User;

	/// channel where the user is invite
	@ManyToOne(() => Channel, (invite_where) => invite_where.id)
	@setService(ChannelService)
	@SetMode("rw")
	invite_where: Channel;
}
