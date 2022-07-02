import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Message } from "@src/entities/message.entity";
import { Channel } from "@entities/channel.entity";
import { Container } from "typedi";
import { MessageQuery } from "@src/queries/messageQuery";
import { SocketService } from "@services/socket.service";

@Injectable()
export class MessageService {
	constructor(
		@InjectRepository(Message)
		private MessageRepository: Repository<Message>,
		private socketService: SocketService,
	) {
		Container.set(this.constructor, this);
	}

	getQuery() {
		return new MessageQuery(this.MessageRepository);
	}

	findAll(userId: string, page = 1, itemByPage = 10): Promise<Message[]> {
		return this.getQuery().see_message(userId).paginate(page, itemByPage).getMany();
	}

	async findAllAndCount(userId: string, page = 1, itemByPage = 10): Promise<[Message[], number]> {
		return this.getQuery().see_message(userId).paginate(page, itemByPage).getManyAndCount();
	}

	findOne(id: number): Promise<Message> {
		return this.getQuery().getOne(id);
	}

	async remove(id: string): Promise<void> {
		await this.MessageRepository.delete(id);
	}

	create(message: Message): Promise<Message> {
		const msg = this.MessageRepository.create(message);
		this.socketService.sendMessage("MSG", msg, (msg.channel as Channel).name);
		return this.save(msg);
	}

	async save(message: Message): Promise<Message> {
		return await this.MessageRepository.save(message);
	}

	update(id: number, message: Message) {
		return this.MessageRepository.update(id, message);
	}

	async findByUser(id: string): Promise<Message[]> {
		return this.getQuery().user(id).getMany();
	}

	async findByChannel(id: number): Promise<Message[]> {
		return this.getQuery().channel(id).getMany();
	}
}
