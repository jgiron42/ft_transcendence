import { Controller, Get, UseGuards, Query, Session } from "@nestjs/common";
import config from "@config/api.config";
import { SessionGuard } from "@guards/session.guard";
import { UserService } from "@src/services/user.service";
import { User } from "@entities/user.entity";
import { SessionT } from "@src/types/session";
import { GetUser } from "@utils/get-user";

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
	me(@GetUser() user: User): User {
		return user;
	}

	@Get("/newUserExample")
	async testDB(@Query() data: { pseudo: string }, @Session() ses: SessionT): Promise<User[]> {
		const usr = {
			id: data.pseudo,
			username: data.pseudo,
			image_url: data.pseudo,
			nb_game: 1,
			nb_win: 0,
			totp_enabled: false,
			status: 0,
			totp_key: "test",
			created_at: new Date(),
		} as User;
		await this.userService.create(usr);
		ses.ftIdentified = 9999999999999;
		ses.totpIdentified = true;
		ses.sessionUser = { id: data.pseudo, accessToken: "", refreshToken: "", firstName: "", lastName: "" };
		return this.userService.findAll();
	}
}
