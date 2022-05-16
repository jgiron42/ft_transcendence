import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Channel } from "@entities/channel.entity";
import { User } from "./user.entity";

@Entity()
export class ChanInvitation {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	date: Date;

	@ManyToOne(() => User, (invite_by) => invite_by.id)
	invite_by: User;

	@ManyToOne(() => User, (invited) => invited.id)
	invited: User;

	@ManyToOne(() => Channel, (invite_where) => invite_where.id)
	invite_where: Channel;
}
