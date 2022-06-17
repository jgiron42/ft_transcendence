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
				.leftJoinAndSelect("chan_connection.user_id", "user")
				.leftJoinAndSelect("chan_connection.chan_id", "channel"),
		);
	}

	user(userId: string) {
		this.query = this.query.andWhere({ user_id: userId });
		return this;
	}

	channel(channelId: number) {
		this.query = this.query.andWhere({ chan_id: channelId });
		return this;
	}

	see_connection(userId: string) {
		this.query = this.query
			.leftJoin(ChanConnection, "other_chan_connection", "other_chan_connection.chanIdId = channel.id")
			.andWhere(
				new Brackets((qb) => {
					qb.where("channel.owner = :userid", { userid: userId })
						.orWhere("other_chan_connection.userIdId = :userid", { userid: userId })
						.orWhere("chan_connection.userIdId = :userid", { userid: userId })
						.orWhere("channel.chat_type = :visibleType", { visibleType: ChannelType.PUBLIC });
				}),
			);
		return this;
	}

	connection_owner(userId: string) {
		this.query = this.query.andWhere(
			new Brackets((qb) => {
				qb.where("chan_connection.userIdId = :userid", { userid: userId }).orWhere("channel.owner = :userid", {
					userid: userId,
				});
			}),
		);
		return this;
	}

	connection_chan_owner(userId: string) {
		this.query = this.query.andWhere("channel.owner = :userid", { userid: userId });
		return this;
	}
}
