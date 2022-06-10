import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Channel } from "@src/entities/channel.entity";
import { Container } from "typedi";

@Injectable()
export class ChannelService {
	constructor(
		@InjectRepository(Channel)
		private ChannelRepository: Repository<Channel>,
	) {
		Container.set(this.constructor, this);
	}

	findAll(): Promise<Channel[]> {
		return this.ChannelRepository.find();
	}

	findOne(id: number): Promise<Channel> {
		return this.ChannelRepository.findOne(id);
	}

	async remove(id: number): Promise<void> {
		await this.ChannelRepository.delete(id);
	}

	async create(channel: Channel): Promise<Channel> {
		return this.ChannelRepository.save(channel);
	}
}
