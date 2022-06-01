import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ChanConnection } from "@entities/chan_connection.entity";
import {Container} from "typedi";

@Injectable()
export class ChanConnectionService {
	constructor(
		@InjectRepository(ChanConnection)
		private ChanConnectionRepository: Repository<ChanConnection>,
	) {Container.set(this.constructor, this)}

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

	async findByUser(id: string): Promise<ChanConnection[]> {
		return this.ChanConnectionRepository.find({ where: [{ user_id: id }] });
	}

	async findByChannel(id: number): Promise<ChanConnection[]> {
		return this.ChanConnectionRepository.find({ where: [{ chan_id: id }] });
	}
}
