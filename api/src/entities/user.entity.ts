import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

// this entity is use to describe the users

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	// pseudo of the user
	@Column()
	pseudo: string;

	// path to the avatar of the user
	@Column()
	path_avatar: string;

	// password of the user
	@Column()
	mdp: string;

	// mail of the user
	@Column()
	mail: string;

	// phone of the user
	@Column()
	phone: string;

	// number of game played by the user
	@Column()
	nb_game: number;

	//  number of game played by the user
	@Column()
	nb_win: number;

	// say if the user use OAuth or not
	@Column()
	OAuth: boolean;

	// status of the user
	@Column()
	status: number;

	// totp key of the user
	@Column({ length: 20 })
	totp_key: string;

	// date of registration of the user
	@Column()
	date_register: Date;
}
