import { Brackets, Repository } from "typeorm";
import { QueryCooker } from "@src/queries/QueryCooker";
import { Message } from "@entities/message.entity";
import { ChanConnection, ChannelRole } from "@entities/chan_connection.entity";
import { RelationType } from "@entities/relation.entity";

export class MessageQuery extends QueryCooker<Message> {
	constructor(entityRepository: Repository<Message>) {
		super(
			entityRepository,
			entityRepository
				.createQueryBuilder("message")
				.leftJoinAndSelect("message.user", "user")
				.leftJoinAndSelect("message.channel", "channel"),
			"message",
		);
		this.sort("message.created_at", "DESC");
	}

	/**
	 * select only the messages sent by userId
	 */
	user(userId: string) {
		this.query = this.query.andWhere("user.id = :userId", { userId });
		return this;
	}

	/**
	 * select only the messages sent to channelId
	 */
	channel(channelId: number) {
		this.query = this.query.andWhere("channel.id = :channelId", { channelId });
		return this;
	}

	/**
	 * select only the messages visible by userId
	 */
	see_message(userId: string) {
		this.query = this.query
			.leftJoin("chan_connection", "chan_connection", "chan_connection.channelId = channel.id")
			.andWhere("chan_connection.userId = :userid1", { userid1: userId })
			.andWhere("chan_connection.role <> :bannedType", { bannedType: ChannelRole.BANNED })
			// load block relations:
			.leftJoin("relation", "relation", "user.id = relation.targetId AND relation.type = :blockedType", {
				userid2: userId,
				blockedType: RelationType.BLOCK,
			})
			.andWhere(
				new Brackets((qb) => {
					qb.where("relation.owner <> :userId3", { userId3: userId }).orWhere("relation IS NULL");
				}),
			);
		return this;
	}

	can_admin(userId: string) {
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
					qb.where("user.id = :userId", { userId })
						.orWhere(`${chan_connection_alias}.role = :ownerType`, { ownerType: ChannelRole.OWNER })
						.orWhere(`${chan_connection_alias}.role = :adminType`, { adminType: ChannelRole.ADMIN });
				}),
			);
		return this;
	}
}
