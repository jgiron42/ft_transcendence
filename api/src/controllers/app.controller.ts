import { Controller, Get } from "@nestjs/common";
import config from "@config/api.config";
import { UserService } from "@src/services/user.service";
// import { User } from "@src/entities/user.entity";
// import { randomInt } from "crypto";
import { User } from "@entities/user.entity";

@Controller()
export class AppController {
	constructor(private userService: UserService) {}

	@Get()
	getHealthcheck(): { status: string; env: string; port: number | string } {
		return { status: "live", env: config.env, port: config.apiPort };
	}
	@Get("/db")
	async testDB(): Promise<User[]> {
		const newUser = new User();
		// newUser.id = randomInt(0, 100);
		newUser.pseudo = "John";
		newUser.mail = "Doe";
		newUser.OAuth = true;
		await this.userService.create(newUser);
		return this.userService.findAll();
	}
}
