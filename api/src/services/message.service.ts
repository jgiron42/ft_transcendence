import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Message } from "@src/entities/message.entity";

@Injectable()
export class MessageService {
	constructor(
		@InjectRepository(Message)
		private MessageRepository: Repository<Message>,
	) {}

	findAll(): Promise<Message[]> {
		return this.MessageRepository.find();
	}

	findOne(id: string): Promise<Message> {
		return this.MessageRepository.findOne(id);
	}

	async remove(id: string): Promise<void> {
		await this.MessageRepository.delete(id);
	}

	async create(message: Message): Promise<Message> {
		return this.MessageRepository.save(message);
	}
}
