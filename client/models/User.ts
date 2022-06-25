export class User {
	id: number;
	pseudo: string;
	path_avatar: string;
	mdp: string;
	mail: string;
	phone: string;
	nb_game: number;
	nb_win: number;
	OAuth: boolean;
	status: number;
	totp_key: string;
	date_register: Date;
}
