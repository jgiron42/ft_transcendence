import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class channel {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	chat_type: number;
}
