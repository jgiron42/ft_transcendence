import { Entity, Column, PrimaryColumn, CreateDateColumn } from "typeorm";
import { Exclude } from "class-transformer";
import { SetMode } from "@utils/set-mode";
import { config as gameConfig } from "@config/game.config";
import { config as userConfig } from "@config/user.config";
import { Length } from "class-validator";

// this entity is use to describe the users

@Entity()
@Exclude()
export class User {
	constructor() {
		this.id = undefined;
		this.nb_game = 0;
		this.nb_win = 0;
		this.nb_loss = 0;
		this.totp_enabled = false;
		this.totp_key = "";
		this.status = 0;
		this.created_at = new Date();
		this.elo = gameConfig.baseELO;
	}

	@PrimaryColumn()
	@SetMode("cr")
	id: string;

	// pseudo of the user
	@Column({ unique: true })
	@Length(userConfig.usernameMinLength, userConfig.usernameMaxLength)
	@SetMode("cru")
	username: string;

	// path to the avatar of the user
	@Column({ default: "" })
	@SetMode("cru")
	image_url: string;

	// number of game played by the user
	@Column({ default: 0 })
	@SetMode("r")
	nb_game: number;

	//  number of game won by the user
	@Column({ default: 0 })
	@SetMode("r")
	nb_win: number;

	//  number of game loss by the user
	@Column({ default: 0 })
	@SetMode("r")
	nb_loss: number;

	// say if the user use OAuth or not
	@Column({ default: false })
	@SetMode([["own_user", "r"], "cu"]) // class-transformer
	totp_enabled: boolean;

	// status of the user
	@Column({ default: 0 })
	@SetMode("cru")
	status: number;

	// totp key of the user in hexadecimal
	@Column({ length: 40, default: "" })
	@SetMode("cu")
	totp_key: string;

	// date of registration of the user
	@CreateDateColumn()
	@SetMode("r")
	created_at: Date;

	// elo rating of the user
	@Column({ default: gameConfig.baseELO })
	@SetMode("cru")
	elo: number;
}
