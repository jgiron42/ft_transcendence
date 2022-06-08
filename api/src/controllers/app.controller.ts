import { Controller, Get, UseGuards } from "@nestjs/common";
import config from "@config/api.config";
import { SessionGuard } from "@guards/session.guard";
import { UserService } from "@src/services/user.service";
import { User } from "@entities/user.entity";

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

	@Get("/newUserExample")
	async testDB(): Promise<User[]> {
		const newUser = {
			pseudo: "test",
			path_avatar: "test",
			nb_game: 0,
			nb_win: 0,
			OAuth: false,
			status: 0,
			totp_key: "test",
			date_register: new Date(),
		} as User;
		await this.userService.create(newUser);
		return this.userService.findAll();
	}
}
