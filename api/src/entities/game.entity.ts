import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "@entities/user.entity";

// this entity is use to stock all the game

@Entity()
export class Game {
	@PrimaryGeneratedColumn()
	id: number;

	// first player id
	@ManyToOne(() => User, (id_first_player) => id_first_player.id)
	user_one: User;

	// second player id
	@ManyToOne(() => User, (id_second_player) => id_second_player.id)
	user_two: User;

	// score of the first player
	@Column()
	score_first_player: number;

	// score of the second player
	@Column()
	score_second_player: number;

	// type of game
	@Column()
	type: number;

	// status of the game
	@Column()
	finished: boolean;

	// date begin of game
	@Column()
	created_at: Date;
}
