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

	/**
	 * select only the channels visible by userId
	 */
	see_channel(userId: string) {
		this.query = this.query.andWhere(
			new Brackets((qb) =>
				qb
					.where("channel.owner = :userid1", { userid1: userId })
					.orWhere("chan_connection.userId = :userid2", { userid2: userId })
					.orWhere("channel.type = :visibleType1", { visibleType1: ChannelType.PUBLIC })
					.orWhere("channel.type = :visibleType2", { visibleType2: ChannelType.PASSWORD }),
			),
		);
		return this;
	}

	/**
	 * select only the channels owned by userId
	 */
	own_channel(userId: string) {
		this.query = this.query.andWhere("channel.owner = :userid3", { userid3: userId });
		return this;
	}

	/**
	 * select only the channels in which userId is
	 */
	on_channel(userId: string) {
		this.query = this.query.andWhere("chan_connection.userId = :userid4", { userid4: userId });
		return this;
	}

	/**
	 * select only the channels of type type
	 */
	type(type: ChannelType) {
		this.query = this.query.andWhere("channel.type = :type", { type });
		return this;
	}
}
