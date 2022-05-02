import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Client {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	pseudo: string;

	@Column()
	path_avatar: string;

	@Column()
	mdp: string;

	@Column()
	mail: string;

	@Column()
	phone: string;

	@Column()
	nb_game: number;

	@Column()
	nb_win: number;

	@Column()
	OAuth: boolean;

	@Column({ length: 20 })
	totp_key: string;
}
