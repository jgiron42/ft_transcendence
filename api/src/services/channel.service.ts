import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { Channel } from "@src/entities/channel.entity";
import { Container } from "typedi";
import { ChanConnection } from "@entities/chan_connection.entity";
import { ChannelQuery } from "@src/queries/channelQuery";
import { compare, hash, genSalt } from "bcrypt";

@Injectable()
export class ChannelService {
	constructor(
		@InjectRepository(Channel)
		private ChannelRepository: Repository<Channel>,
		@InjectEntityManager("default")
		private entityManager: EntityManager,
	) {
		Container.set(this.constructor, this);
	}

	static async checkPassword(password: string, passwordHash: string): Promise<void> {
		if (!password || !(await compare(password, passwordHash))) throw new BadRequestException("Invalid password");
	}

	static async hashPassword(password: string): Promise<string> {
		return hash(password, await genSalt());
	}

	getQuery() {
		return new ChannelQuery(this.ChannelRepository);
	}

	findOne(id: number): Promise<Channel> {
		return this.ChannelRepository.findOneBy({ id });
	}

	findByConnection(id: number): Promise<Channel> {
		return this.entityManager
			.createQueryBuilder()
			.select("channel")
			.from(Channel, "channel")
			.leftJoin(ChanConnection, "chan_connection", "chan_connection.channelIdId = channel.id")
			.where("chan_connection.channelIdId = :id", { id })
			.getOne();
	}

	async remove(id: number): Promise<void> {
		await this.getQuery().remove(id);
	}

	create(channel: Channel): Promise<Channel> {
		return this.save(this.ChannelRepository.create(channel));
	}

	async save(channel: Channel): Promise<Channel> {
		return await this.ChannelRepository.save(channel);
	}
}
