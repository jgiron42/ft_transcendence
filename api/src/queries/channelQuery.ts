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
				.leftJoin(ChanConnection, "chan_connection", "chan_connection.channelId = channel.id"),
		);
		this.sort("channel.created_at", "DESC");
	}

	/**
	 * select only the channels visible by userId
	 */
	see_channel(userId: string) {
		this.query = this.query.andWhere(
			new Brackets((qb) =>
				qb
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
		const alias = `chan_connection${this.newId}`;

		this.query = this.query
			.leftJoin(ChanConnection, alias, `${alias}.channelId = channel.id`)
			.andWhere(`${alias}.userId = :${this.newId}`, { [this.currentId]: userId })
			.andWhere(`${alias}.role = :ownerType`, { ownerType: ChannelRole.OWNER });
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
	 * select only the channels in which userId is
	 */
	can_talk(userId: string) {
		const chan_connection = `chan_connection${this.newId}`;
		this.query = this.query
			.leftJoin(ChanConnection, chan_connection, `${chan_connection}.channelId = channel.id`)
			.andWhere(`${chan_connection}.userId = :${this.newId}`, {
				[this.currentId]: userId,
			})
			.andWhere(`${chan_connection}.role <> :bannedType`, { bannedType: ChannelRole.BANNED })
			.andWhere(
				new Brackets((qb) => {
					qb.where(`${chan_connection}.mute_end IS NULL`).orWhere(`${chan_connection}.mute_end < :now`, {
						now: new Date(),
					});
				}),
			);
		return this;
	}

	/**
	 * select only the channels of type type
	 */
	type(type: ChannelType, invert = false) {
		if (!invert) this.query = this.query.andWhere("channel.type = :type", { type });
		else this.query = this.query.andWhere("channel.type <> :type", { type });
		return this;
	}
}
