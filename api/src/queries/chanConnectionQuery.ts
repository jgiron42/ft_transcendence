import { ChanConnection, ChannelRole } from "@entities/chan_connection.entity";
import { ChannelType } from "@entities/channel.entity";
import { Brackets, Repository } from "typeorm";
import { QueryCooker } from "@src/queries/QueryCooker";

export class ChanConnectionQuery extends QueryCooker<ChanConnection> {
	constructor(entityRepository: Repository<ChanConnection>) {
		super(
			entityRepository,
			entityRepository
				.createQueryBuilder("chan_connection")
				.leftJoinAndSelect("chan_connection.user", "user")
				.leftJoinAndSelect("chan_connection.channel", "channel"),
		);
		this.sort("chan_connection.created_at", "DESC");
	}

	/**
	 * select only the connections of userId
	 */
	user(userId: string) {
		this.query = this.query.andWhere({ user: userId });
		return this;
	}

	/**
	 * select only the connections with channelId
	 */
	channel(channelId: number) {
		this.query = this.query.andWhere({ channel: channelId });
		return this;
	}

	/**
	 * same as channel exclude banned connections
	 */
	notBan() {
		this.query = this.query.andWhere("chan_connection.role <> :bannedType", { bannedType: ChannelRole.BANNED });
		return this;
	}

	/**
	 * select only the connections visible by userId
	 */
	see_connection(userId: string) {
		this.query = this.query
			.leftJoin(ChanConnection, "other_chan_connection", "other_chan_connection.channelId = channel.id")
			.andWhere(
				new Brackets((qb) => {
					qb.where(`other_chan_connection.userId = :${this.newId}`, { [this.currentId]: userId })
						.orWhere(`chan_connection.userId = :${this.newId}`, { [this.currentId]: userId })
						.orWhere("channel.type = :visibleType", { visibleType: ChannelType.PUBLIC });
				}),
			)
			// exclude banned connections
			.andWhere(
				new Brackets((qb) => {
					qb.where(`other_chan_connection.role = :ownerType`, { ownerType: ChannelRole.OWNER })
						.orWhere(`other_chan_connection.role = :adminType`, { adminType: ChannelRole.ADMIN })
						.orWhere("chan_connection.role <> :bannedType", { bannedType: ChannelRole.BANNED });
				}),
			);
		return this;
	}

	/**
	 * select only the connections to channels owned by userId
	 */
	connection_chan_owner(userId: string) {
		const alias = `chan_connection${this.newId}`;

		this.query = this.query
			.leftJoin(ChanConnection, alias, `${alias}.channelId = channel.id`)
			.andWhere(`${alias}.userId = :${this.newId}`, { [this.currentId]: userId })
			.andWhere(`${alias} = :ownerType`, { ownerType: ChannelRole.OWNER });
		return this;
	}

	/**
	 * select only the connections to channels where userId is admin
	 */
	connection_chan_admin(userId: string) {
		const chan_connection_alias = `chan_connection${this.newId}`;
		this.query = this.query
			.leftJoin(
				ChanConnection,
				chan_connection_alias,
				`${chan_connection_alias}.channelId = channel.id AND ${chan_connection_alias}.userId = :${this.newId}`,
				{ [this.currentId]: userId },
			)
			.andWhere(
				new Brackets((qb) => {
					qb.where(`${chan_connection_alias}.role = :ownerType`, { ownerType: ChannelRole.OWNER }).orWhere(
						`${chan_connection_alias}.role = :adminType`,
						{ adminType: ChannelRole.ADMIN },
					);
				}),
			)
			.andWhere("chan_connection.role <> :ownerType", { bannedType: ChannelRole.OWNER }); // nobody can administrate the owner
		return this;
	}
}
