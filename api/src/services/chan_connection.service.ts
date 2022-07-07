import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ChanConnection } from "@entities/chan_connection.entity";
import { ChannelRole } from "@entities/chan_connection.entity";
import { Container } from "typedi";
import { ChanConnectionQuery } from "@src/queries/chanConnectionQuery";
import { DeepPartial } from "typeorm/common/DeepPartial";
import { SocketService } from "@services/socket.service";

@Injectable()
export class ChanConnectionService {
	constructor(
		@InjectRepository(ChanConnection)
		private ChanConnectionRepository: Repository<ChanConnection>,
		private socketService: SocketService,
	) {
		Container.set(this.constructor, this);
	}

	getQuery() {
		return new ChanConnectionQuery(this.ChanConnectionRepository);
	}

	findOne(id: number): Promise<ChanConnection> {
		return this.getQuery().getOne(id);
	}

	async remove(id: number): Promise<void> {
		await this.getQuery().remove(id);
	}

	create(chanConnection: DeepPartial<ChanConnection>): Promise<ChanConnection> {
		const connection = this.ChanConnectionRepository.create(chanConnection);
		connection.role = ChannelRole.OWNER;
		this.socketService.sendMessage("updateUsers", null, connection.channel.name);
		return this.save(connection);
	}

	async save(chanConnection: ChanConnection): Promise<ChanConnection> {
		return await this.ChanConnectionRepository.save(chanConnection);
	}

	update(id: number, chanConnection: ChanConnection) {
		return this.getQuery().update(chanConnection, id);
	}

	async findByUser(id: string): Promise<ChanConnection[]> {
		return this.getQuery().user(id).getMany();
	}

	async findByChannel(id: number): Promise<ChanConnection[]> {
		return this.getQuery().channel(id).getMany();
	}

	async isOnChannel(userId: string, channelId: number): Promise<boolean> {
		return !!(await this.getQuery().channel(channelId).user(userId).query.getOne());
	}
}
