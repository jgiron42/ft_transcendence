import { ChanConnection } from "@entities/chan_connection.entity";
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
				.leftJoinAndSelect("chan_connection.channel", "channel")
				.leftJoinAndSelect("channel.owner", "chanOwner"),
		);
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
	 * select only the connections visible by userId
	 */
	see_connection(userId: string) {
		this.query = this.query
			.leftJoin(ChanConnection, "other_chan_connection", "other_chan_connection.channelId = channel.id")
			.andWhere(
				new Brackets((qb) => {
					qb.where("channel.owner = :userid1", { userid1: userId })
						.orWhere("other_chan_connection.userId = :userid2", { userid2: userId })
						.orWhere("chan_connection.userId = :userid3", { userid3: userId })
						.orWhere("channel.type = :visibleType", { visibleType: ChannelType.PUBLIC });
				}),
			);
		return this;
	}

	/**
	 * select only the connections owned by userId
	 */
	connection_owner(userId: string) {
		this.query = this.query.andWhere(
			new Brackets((qb) => {
				qb.where("chan_connection.userId = :userid4", { userid4: userId }).orWhere("channel.owner = :userid5", {
					userid5: userId,
				});
			}),
		);
		return this;
	}

	/**
	 * select only the connections to channels owned by userId
	 */
	connection_chan_owner(userId: string) {
		this.query = this.query.andWhere("channel.owner = :userid6", { userid6: userId });
		return this;
	}
}
