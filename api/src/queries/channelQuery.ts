import { ChanConnection, ChannelRole } from "@entities/chan_connection.entity";
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
					.where(`channel.owner = :${this.newId}`, { [this.currentId]: userId })
					.orWhere(
						new Brackets((qb2) => {
							qb2.where(`chan_connection.userId = :${this.newId}`, { [this.currentId]: userId }).andWhere(
								"chan_connection.role <> :bannedType",
								{ bannedType: ChannelRole.BANNED },
							);
						}),
					)
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
		this.query = this.query.andWhere(`channel.owner = :${this.newId}`, { [this.currentId]: userId });
		return this;
	}

	/**
	 * select only the channels in which userId is
	 */
	on_channel(userId: string) {
		const chan_connection = `chan_connection${this.newId}`;
		this.query = this.query
			.leftJoin(ChanConnection, chan_connection, `${chan_connection}.channelId = channel.id`)
			.andWhere(`${chan_connection}.userId = :${this.newId}`, {
				[this.currentId]: userId,
			})
			.andWhere(`${chan_connection}.role <> :bannedType`, { bannedType: ChannelRole.BANNED });
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
