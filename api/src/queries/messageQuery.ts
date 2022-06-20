import { Repository } from "typeorm";
import { QueryCooker } from "@src/queries/QueryCooker";
import { Message } from "@entities/message.entity";

export class MessageQuery extends QueryCooker<Message> {
	constructor(entityRepository: Repository<Message>) {
		super(
			entityRepository,
			entityRepository
				.createQueryBuilder("message")
				.leftJoinAndSelect("message.user", "user")
				.leftJoinAndSelect("message.channel", "channel"),
		);
	}

	user(userId: string) {
		this.query = this.query.andWhere("user.id = :userId", { userId });
		return this;
	}

	channel(channelId: number) {
		this.query = this.query.andWhere("channel.id = :channelId", { channelId });
		return this;
	}

	see_message(userId: string) {
		this.query = this.query
			.leftJoin("chan_connection", "chan_connection", "chan_connection.channelId = channel.id")
			.andWhere("chan_connection.userId = :userid1", { userid1: userId });
		return this;
	}
}
