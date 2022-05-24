import { Controller, Get, UseGuards } from "@nestjs/common";
import config from "@config/api.config";
import { SessionGuard } from "@guards/session.guard";

@Controller()
export class AppController {
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
		const newUser = new User();
		newUser.pseudo = "John";
		newUser.mail = "Doe";
		newUser.OAuth = true;
		await this.userService.create(newUser);
		return this.userService.findAll();
	}
}
