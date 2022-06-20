import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import config from "@config/api.config";
import { SessionGuard } from "@guards/session.guard";
import { UserService } from "@src/services/user.service";
import { User } from "@entities/user.entity";
import { Request } from "@src/types/request";

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

	@UseGuards(...SessionGuard)
	@Get("me")
	me(@Req() req: Request) {
		return req.user;
	}

	@Get("/newUserExample")
	async testDB(): Promise<User[]> {
		const newUser = {
			id: "foo",
			username: "test",
			pseudo: "test",
			image_url: "test",
			nb_game: 0,
			nb_win: 0,
			totp_enabled: false,
			status: 0,
			totp_key: "test",
			created_at: new Date(),
		} as User;
		await this.userService.create(newUser);
		return this.userService.findAll();
	}
}
