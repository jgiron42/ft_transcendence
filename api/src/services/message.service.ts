import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Message } from "@src/entities/message.entity";
import { Channel } from "@src/entities/channel.entity";

@Injectable()
export class MessageService {
	constructor(
		@InjectRepository(Message)
		private MessageRepository: Repository<Message>,
	) {}

	findAll(): Promise<Message[]> {
		return this.MessageRepository.find();
	}

	findOne(id: number): Promise<Message> {
		return this.MessageRepository.findOne({ where: { id } });
	}

	findByChannel(channel: Channel): Promise<Message[]> {
		return this.MessageRepository.find({ where: { dest_channel: channel } });
	}

	async remove(id: string): Promise<void> {
		await this.MessageRepository.delete(id);
	}

	async create(message: Message): Promise<Message> {
		return this.MessageRepository.save(message);
	}
}
