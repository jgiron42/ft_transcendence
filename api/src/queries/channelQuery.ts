import { ChanConnection } from "@entities/chan_connection.entity";
import { Channel, ChannelType } from "@entities/channel.entity";
import { Brackets, Repository } from "typeorm";
import { QueryCooker } from "@src/queries/QueryCooker";

export class ChannelQuery extends QueryCooker<Channel> {
	constructor(entityRepository: Repository<Channel>) {
		super(
			entityRepository,
			entityRepository
				.createQueryBuilder("channel")
				.leftJoin(ChanConnection, "chan_connection", "chan_connection.channelId = channel.id")
				.leftJoinAndSelect("channel.owner", "user"),
		);
	}

	see_channel(userId: string) {
		this.query = this.query.andWhere(
			new Brackets((qb) =>
				qb
					.where("channel.owner = :userid1", { userid1: userId })
					.orWhere("chan_connection.userId = :userid2", { userid2: userId })
					.orWhere("channel.type = :visibleType", { visibleType: ChannelType.PUBLIC }),
			),
		);
		return this;
	}

	own_channel(userId: string) {
		this.query = this.query.andWhere("channel.owner = :userid1", { userid1: userId });
		return this;
	}

	on_channel(userId: string) {
		this.query = this.query.andWhere("chan_connection.userId = :userid2", { userid2: userId });
		return this;
	}
}
