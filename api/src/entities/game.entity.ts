import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "@entities/user.entity";

@Entity()
export class Game {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, (id_first_player) => id_first_player.id)
	id_first_player: User;

	@ManyToOne(() => User, (id_second_player) => id_second_player.id)
	id_second_player: User;

	@Column()
	score_first_player: number;

	@Column()
	score_second_player: number;

	@ManyToOne(() => User, (winner) => winner.id)
	winner: User;

	@Column()
	type: number;

	@Column()
	status: boolean;

	@Column()
	date: Date;
}
