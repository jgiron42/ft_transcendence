import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Client } from "@entities/client.entity";
import { Channel } from "@entities/channel.entity";

@Entity()
export class ChanInvitation {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	date: Date;

	@ManyToOne(() => Client, (invite_by) => invite_by.id)
	invite_by: Client;

	@ManyToOne(() => Client, (invited) => invited.id)
	invited: Client;

	@ManyToOne(() => Channel, (invite_where) => invite_where.id)
	invite_where: Channel;
}
