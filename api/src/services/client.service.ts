import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Client } from "@src/entities/client.entity";

@Injectable()
export class ClientService {
	constructor(
		@InjectRepository(Client)
		private clientsRepository: Repository<Client>,
	) {}

	findAll(): Promise<Client[]> {
		return this.clientsRepository.find();
	}

	findOne(id: string): Promise<Client> {
		return this.clientsRepository.findOne(id);
	}

	async remove(id: string): Promise<void> {
		await this.clientsRepository.delete(id);
	}
}
