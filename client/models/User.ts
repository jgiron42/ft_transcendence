// User type declaration identical to API's one.
export class User {
	constructor() {
		this.id = null;
		this.username = "";
		this.image_url = "";
		this.nb_game = 0;
		this.nb_loss = 0;
		this.nb_win = 0;
		this.totp_enabled = false;
		this.totp_key = "";
		this.status = 0;
		this.created_at = new Date();
	}

	id: string | null;
	username: string;
	image_url: string;
	nb_game: number;
	nb_win: number;
	nb_loss: number;
	totp_enabled: boolean;
	status: number;
	totp_key: string;
	created_at: Date;
}
