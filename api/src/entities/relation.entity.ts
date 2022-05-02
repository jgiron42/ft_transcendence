import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Relation {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	user_one: number;

	@Column()
	user_two: number;

	@Column()
	relation_type: number;
}
