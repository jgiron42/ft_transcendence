import { Controller, Get } from "@nestjs/common";
import config from "@config/api.config";
import { Client } from "@entities/client.entity";
import { ClientService } from "@services/client.service";

@Controller()
export class AppController {
	constructor(private clientService: ClientService) {}

	@Get()
	getHealthcheck(): { status: string; env: string; port: number | string } {
		return { status: "live", env: config.env, port: config.apiPort };
	}
	@Get("/db")
	async testDB(): Promise<Client[]> {
		/*const userRepository = AppDataSource.getRepository(Client)

		const client = new Client
		client.pseudo = "prout"
		client.path_avatar = "lol"
		client.mdp = "lol"
		client.mail = "lolé"
		client.phone = "0635300278"
		client.nb_game = 0
		client.nb_win = 0
		client.OAuth = false
		client.totp_key = ""

		await userRepository.save(client);
		*/

		return this.clientService.findAll();
	}
}
