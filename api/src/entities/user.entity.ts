import { Entity, Column, PrimaryColumn } from "typeorm";
import { Exclude } from "class-transformer";
import {SetMode} from "@utils/set-mode";

// this entity is use to describe the users

@Entity()
@Exclude()
export class User {
	@PrimaryColumn()
	@SetMode("r")
	id: string;

	// pseudo of the user
	@Column({ unique: true })
	@SetMode("rw")
	pseudo: string;

	// path to the avatar of the user
	@Column()
	@SetMode("rw")
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
	@SetMode("rw", {groups:['private']}) // class-transformer
	OAuth: boolean;

	// status of the user
	@Column()
	@SetMode("rw")
	status: number;

	// totp key of the user
	@Column({ length: 20 })
	@SetMode("w")
	totp_key: string;

	// date of registration of the user
	@Column()
	@SetMode("r")
	date_register: Date;
}
