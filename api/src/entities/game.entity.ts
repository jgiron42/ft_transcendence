import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Game {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	id_first_player: number;

	@Column()
	id_second_player: number;

	@Column()
	score_first_player: number;

	@Column()
	score_second_player: number;

	@Column()
	winner: number;
}
