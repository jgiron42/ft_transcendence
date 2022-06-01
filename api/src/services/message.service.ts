import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Message } from "@src/entities/message.entity";
import {Container} from "typedi";

@Injectable()
export class MessageService {
	constructor(
		@InjectRepository(Message)
		private MessageRepository: Repository<Message>,
	) {Container.set(this.constructor, this)}

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

	async findByUser(id: string): Promise<Message[]> {
		return this.MessageRepository.find({ where: [{ send_by: id }] });
	}

	async findByChannel(id: number): Promise<Message[]> {
		return this.MessageRepository.find({ where: [{ dest_channel: id }] });
	}
}
