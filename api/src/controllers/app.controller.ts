import { Controller, Get } from "@nestjs/common";
import config from "@config/api.config";
import { ClientService } from "@src/services/client.service";
// import { User } from "@src/entities/user.entity";
// import { randomInt } from "crypto";
import { Client } from "@entities/client.entity";

@Controller()
export class AppController {
	constructor(private clientService: ClientService) {}

	@Get()
	getHealthcheck(): { status: string; env: string; port: number | string } {
		return { status: "live", env: config.env, port: config.apiPort };
	}
	@Get("/db")
	async testDB(): Promise<Client[]> {
		const newUser = new Client();
		// newUser.id = randomInt(0, 100);
		newUser.pseudo = "John";
		newUser.mail = "Doe";
		newUser.OAuth = true;
		await this.clientService.create(newUser);
		return this.clientService.findAll();
	}
}
