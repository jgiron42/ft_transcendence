import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ChanConnection {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	chan_id: number;

	@Column()
	client_id: number;
}
