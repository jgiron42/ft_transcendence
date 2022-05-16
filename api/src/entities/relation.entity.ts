import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Client } from "@entities/client.entity";

@Entity()
export class Relation {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Client, (user_one) => user_one.id)
	user_one: Client;

	@ManyToOne(() => Client, (user_two) => user_two.id)
	user_two: Client;

	@Column()
	relation_type: number;
}
