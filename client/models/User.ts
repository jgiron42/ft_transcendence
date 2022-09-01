import { StringifiableModel } from "./StringifiableModel";

// User type declaration identical to API's one.
interface UserInterface {
	id: string;
	username: string;
	image_url: string;
	nb_game: number;
	nb_loss: number;
	nb_win: number;
	totp_enabled: boolean;
	totp_key: string;
	status: number;
	created_at: Date;
	elo: number;
}

export class User extends StringifiableModel implements UserInterface {
	constructor() {
		super();
		this.id = "";
		this.username = "";
		this.image_url = "";
		this.nb_game = 0;
		this.nb_loss = 0;
		this.nb_win = 0;
		this.totp_enabled = false;
		this.totp_key = "";
		this.status = 0;
		this.created_at = new Date();
		this.elo = 0;
	}

	id: string;
	username: string;
	image_url: string;
	nb_game: number;
	nb_win: number;
	nb_loss: number;
	totp_enabled: boolean;
	status: number;
	totp_key: string;
	created_at: Date;
	elo: number;
}
