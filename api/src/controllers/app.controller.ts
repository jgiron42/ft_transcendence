import { Controller, Get, UseGuards, Query, Session } from "@nestjs/common";
import config from "@config/api.config";
import { SessionGuard } from "@guards/session.guard";
import { UserService } from "@src/services/user.service";
import { User } from "@entities/user.entity";
import { SessionT } from "@src/types/session";

@Controller()
export class AppController {
	constructor(private userService: UserService) {}

	// Route used by healthchecks
	@Get()
	getHealthcheck(): { status: string; env: string; port: number | string } {
		return { status: "live", env: config.env, port: config.apiPort };
	}

	// Route testing session guard
	@UseGuards(...SessionGuard)
	@Get("authTest")
	test() {
		return "user is correctly authenticated";
	}

	// @Get("/newUserExample")
	// async testDB(): Promise<User[]> {
	// 	const newUser = {
	// 		pseudo: "test",
	// 		path_avatar: "test",
	// 		mdp: "test",
	// 		mail: "test",
	// 		phone: "test",
	// 		nb_game: 0,
	// 		nb_win: 0,
	// 		OAuth: false,
	// 		status: 0,
	// 		totp_key: "test",
	// 		date_register: new Date(),
	// 	} as User;
	// 	await this.userService.create(newUser);
	// 	return this.userService.findAll();
	// }

	@Get("/newUserExample")
	async testDB(@Query() data: { pseudo: string }, @Session() ses: SessionT): Promise<User[]> {
		const usr = {
			pseudo: data.pseudo,
			path_avatar: data.pseudo,
			mdp: "test",
			mail: "test",
			phone: "test",
			nb_game: 0,
			nb_win: 0,
			OAuth: false,
			status: 0,
			totp_key: "test",
			date_register: new Date(),
		} as User;
		await this.userService.create(usr);
		ses.ftIdentified = 9999999999999;
		ses.totpIdentified = true;
		ses.user = { id: data.pseudo, accessToken: "", refreshToken: "", firstName: "", lastName: "" };
		return this.userService.findAll();
	}
}
