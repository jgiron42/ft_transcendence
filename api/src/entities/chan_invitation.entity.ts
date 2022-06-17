import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Channel } from "@entities/channel.entity";
import { setService } from "@utils/setFinalType.decorator";
import { UserService } from "@services/user.service";
import { ChannelService } from "@services/channel.service";
import { SetMode } from "@utils/set-mode";
import { Validate } from "class-validator";
import { UserExistsRule } from "@src/validators/userExist.validator";
import { ChannelExistRule } from "@src/validators/channelExist.validator";
import { User } from "./user.entity";

// entity use to manage the channel invitation

@Entity()
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
	@ManyToOne(() => User, (invite_by) => invite_by.id, { eager: true, onDelete: "CASCADE" })
	@Validate(UserExistsRule) // class-validator
	@setService(UserService)
	@SetMode("r")
	invite_by: User | string;

	// who is invited to join the channel
	@ManyToOne(() => User, (invited) => invited.id, { eager: true, onDelete: "CASCADE" })
	@Validate(UserExistsRule) // class-validator
	@setService(UserService)
	@SetMode("rcu")
	invited: User | string;

	/// channel where the user is invite
	@ManyToOne(() => Channel, (invite_where) => invite_where.id, { eager: true, onDelete: "CASCADE" })
	@Validate(ChannelExistRule) // class-validator
	@setService(ChannelService)
	@SetMode("rcu")
	invite_where: Channel;
}
