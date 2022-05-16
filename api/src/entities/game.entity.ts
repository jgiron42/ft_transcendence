import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Client } from "@entities/client.entity";

@Entity()
export class Game {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Client, (id_first_player) => id_first_player.id)
	id_first_player: Client;

	@ManyToOne(() => Client, (id_second_player) => id_second_player.id)
	id_second_player: Client;

	@Column()
	score_first_player: number;

	@Column()
	score_second_player: number;

	@ManyToOne(() => Client, (winner) => winner.id)
	winner: Client;

	@Column()
	type: number;

	@Column()
	status: boolean;

	@Column()
	date: Date;
}
