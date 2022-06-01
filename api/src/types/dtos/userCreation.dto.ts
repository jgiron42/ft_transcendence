export class UserCreation {
	id: string;
	pseudo: string;
	path_avatar: string;
	nb_game: number;
	nb_win: number;
	OAuth: boolean;
	status: number;
	totp_key: string;
	date_register?: Date;
}
