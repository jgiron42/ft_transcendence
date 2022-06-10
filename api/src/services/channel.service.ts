import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Channel } from "@src/entities/channel.entity";
import { MessageService } from "@services/message.service";
import { Socket } from "socket.io";

@Injectable()
export class ChannelService {
	private channelMap: Map<string, string>;

	private logger: Logger = new Logger("ChannelService");

	constructor(
		@InjectRepository(Channel) private ChannelRepository: Repository<Channel>,
		private messageService: MessageService,
	) {
		this.channelMap = new Map<string, string>();
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		this.createRealm();
		void this.logger;
	}

	findAll(): Promise<Channel[]> {
		return this.ChannelRepository.find();
	}

	findOne(id: number): Promise<Channel> {
		return this.ChannelRepository.findOne({ where: { id } });
	}

	async findByName(name: string): Promise<Channel> {
		return this.ChannelRepository.findOne({ where: { name } });
	}

	async remove(id: string): Promise<void> {
		await this.ChannelRepository.delete(id);
	}

	async create(channel: Channel): Promise<Channel> {
		return await this.ChannelRepository.save(channel);
	}

	async createRealm(): Promise<void> {
		try {
			await this.ChannelRepository.save(new Channel("realm", undefined));
			await this.ChannelRepository.save(new Channel("realm2", undefined));
		} catch (e) {
			this.logger.error(e);
		}
	}

	async joinChannel(client: Socket, channel: string): Promise<void> {
		const chan = await this.findByName(channel);
		if (chan !== undefined && channel !== undefined) {
			await this.leaveChannel(client);
			this.channelMap.set(client.id, channel);
			await client.join(channel);
			const messages = await this.messageService.findByChannel(chan);
			client.emit("JC", { chan, messages });
		} else {
			throw new Error("Channel not found");
		}
	}

	async leaveChannel(client: Socket): Promise<void> {
		if (this.channelMap.has(client.id)) {
			const chan = this.channelMap.get(client.id);
			await client.leave(chan);
		}
	}

	async delClient(client: Socket): Promise<void> {
		if (this.channelMap.has(client.id)) {
			await this.leaveChannel(client);
			this.channelMap.delete(client.id);
		}
	}

	async getChannelBySocketId(socketId: string): Promise<Channel> {
		if (!this.channelMap.has(socketId)) {
			throw new Error("Socket not in channel");
		}
		const chanName = this.channelMap.get(socketId);
		const chan = await this.findByName(chanName);
		if (!chan) {
			throw new Error("Channel not found");
		}
		return chan;
	}
}
