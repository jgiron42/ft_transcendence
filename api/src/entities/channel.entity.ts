import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Channel {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	chat_type: number;
}
