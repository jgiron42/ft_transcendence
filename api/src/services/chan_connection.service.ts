import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ChanConnection } from "@entities/chan_connection.entity";

@Injectable()
export class ChanConnectionService {
	constructor(
		@InjectRepository(ChanConnection)
		private ChanConnectionRepository: Repository<ChanConnection>,
	) {}

	findAll(): Promise<ChanConnection[]> {
		return this.ChanConnectionRepository.find();
	}

	findOne(id: string): Promise<ChanConnection> {
		return this.ChanConnectionRepository.findOne(id);
	}

	async remove(id: string): Promise<void> {
		await this.ChanConnectionRepository.delete(id);
	}

	async create(chanconnection: ChanConnection): Promise<ChanConnection> {
		return this.ChanConnectionRepository.save(chanconnection);
	}
}
