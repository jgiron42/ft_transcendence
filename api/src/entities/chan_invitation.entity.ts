import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Channel } from "@entities/channel.entity";
import { User } from "./user.entity";

// entity use to manage the channel invitation

@Entity()
export class ChanInvitation {
	@PrimaryGeneratedColumn()
	id: number;

	// date of invitation
	@Column()
	date: Date;

	// who invite a user to join a channel
	@ManyToOne(() => User, (invite_by) => invite_by.id)
	invite_by: User;

	// who is invited to join the channel
	@ManyToOne(() => User, (invited) => invited.id)
	invited: User;

	/// channel where the user is invite
	@ManyToOne(() => Channel, (invite_where) => invite_where.id)
	invite_where: Channel;
}
