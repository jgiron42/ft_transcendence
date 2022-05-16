import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Client } from "@entities/client.entity";

@Entity()
export class Channel {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	chat_type: number;

	@Column()
	mdp: string;

	@ManyToOne(() => Client, (owner) => owner.id)
	owner: Client;
}
