import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

// this entity is use to describe the users

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: string;

	// pseudo of the user
	@Column()
	username: string;

	// path to the avatar of the user
	@Column()
	image_url: string;

	// number of game played by the user
	@Column()
	nb_game: number;

	//  number of game played by the user
	@Column()
	nb_win: number;

	// say if the user use OAuth or not
	@Column()
	totp_enabled: boolean;

	// totp key of the user
	@Column({ length: 20 })
	totp_key: string;

	// status of the user
	@Column()
	status: number;

	// date of registration of the user
	@Column()
	created_at: Date;
}
