import { Injectable, Inject } from "@nestjs/common";
import { Repository } from "typeorm";
import { Client } from "@entities/client.entity";

@Injectable()
export class ClientService {
	constructor(
		@Inject("CLIENT_REPOSITORY")
		private clientRepository: Repository<Client>,
	) {}

	async findAll(): Promise<Client[]> {
		return this.clientRepository.find();
	}
}
