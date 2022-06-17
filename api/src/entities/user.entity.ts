import { Entity, Column, PrimaryColumn } from "typeorm";
import { Exclude } from "class-transformer";
import { SetMode } from "@utils/set-mode";

// this entity is use to describe the users

@Entity()
@Exclude()
export class User {
	constructor() {
		this.id = undefined;
		this.path_avatar = ""; // may be a default avatar path
		this.nb_game = 0;
		this.nb_win = 0;
		this.OAuth = false;
		this.totp_key = "";
		this.status = 0;
		this.date_register = new Date();
	}
	@PrimaryColumn()
	@SetMode("cr")
	id: string;

	// pseudo of the user
	@Column({ unique: true })
	@SetMode("cru")
	pseudo: string;

	// path to the avatar of the user
	@Column()
	@SetMode("cru")
	path_avatar: string;

	// number of game played by the user
	@Column()
	@SetMode("r")
	nb_game: number;

	//  number of game played by the user
	@Column()
	@SetMode("r")
	nb_win: number;

	// say if the user use OAuth or not
	@Column()
	@SetMode([["own_user", "r"], "cu"]) // class-transformer
	OAuth: boolean;

	// status of the user
	@Column()
	@SetMode("cru")
	status: number;

	// totp key of the user
	@Column({ length: 20 })
	@SetMode("cu")
	totp_key: string;

	// date of registration of the user
	@Column()
	@SetMode("r")
	date_register: Date;
}
