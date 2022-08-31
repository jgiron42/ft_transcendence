import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique, CreateDateColumn } from "typeorm";
import { Channel } from "@entities/channel.entity";
import { setService } from "@utils/setFinalType.decorator";
import { UserService } from "@services/user.service";
import { ChannelService } from "@services/channel.service";
import { SetMode } from "@utils/set-mode";
import { User } from "./user.entity";

// entity use to manage the channel invitation

@Entity()
@Unique("unique_invitation", ["channel", "user", "invited_by"])
export class ChanInvitation {
	@PrimaryGeneratedColumn()
	@SetMode("r")
	id: number;

	// who is invited to join the channel
	@ManyToOne(() => User, (invited) => invited.id, { eager: true, onDelete: "CASCADE" })
	@setService(UserService)
	@SetMode("rcu")
	user: User | string;

	// who invite a user to join a channel
	@ManyToOne(() => User, (invite_by) => invite_by.id, { eager: true, onDelete: "CASCADE" })
	@SetMode("r")
	invited_by: User;

	// channel where the user is invited
	@ManyToOne(() => Channel, (channel) => channel.id, { eager: true, onDelete: "CASCADE" })
	@setService(ChannelService)
	@SetMode("ru")
	channel: Channel;

	// date of invitation
	@CreateDateColumn()
	@SetMode("r")
	created_at: Date;
}
