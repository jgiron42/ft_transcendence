import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "@entities/user.entity";

// this entity is use to stock all the game

@Entity()
export class Game {
	@PrimaryGeneratedColumn()
	id: number;

	// first player id
	@ManyToOne(() => User, (id_first_player) => id_first_player.id)
	id_first_player: User;

	// second player id
	@ManyToOne(() => User, (id_second_player) => id_second_player.id)
	id_second_player: User;

	// score of the first player
	@Column()
	score_first_player: number;

	// score of the second player
	@Column()
	score_second_player: number;

	// winner of the game
	@ManyToOne(() => User, (winner) => winner.id)
	winner: User;

	// type of game
	@Column()
	type: number;

	// status of the game
	@Column()
	status: boolean;

	// date begin of game
	@Column()
	date: Date;
}
