import { Repository } from "typeorm";
import { QueryCooker } from "@src/queries/QueryCooker";
import { Message } from "@entities/message.entity";

export class MessageQuery extends QueryCooker<Message> {
	constructor(entityRepository: Repository<Message>) {
		super(
			entityRepository,
			entityRepository
				.createQueryBuilder("message")
				.leftJoinAndSelect("message.send_by", "user")
				.leftJoinAndSelect("message.dest_channel", "channel"),
		);
	}

	user(userId: string) {
		this.query = this.query.andWhere("user.id = :userId", { userId });
		return this;
	}

	channel(chanId: number) {
		this.query = this.query.andWhere("channel.id = :chanId", { chanId });
		return this;
	}

	see_message(userId: string) {
		this.query = this.query
			.leftJoin("chan_connection", "chan_connection", "chan_connection.chanIdId = channel.id")
			.andWhere("chan_connection.userIdId = :userid1", { userid1: userId });
		return this;
	}
}
