import { Brackets, Repository } from "typeorm";
import { QueryCooker } from "@src/queries/QueryCooker";
import { ChanInvitation } from "@entities/chan_invitation.entity";

export class InviteQuery extends QueryCooker<ChanInvitation> {
	constructor(entityRepository: Repository<ChanInvitation>) {
		super(
			entityRepository,
			entityRepository
				.createQueryBuilder("invitation")
				.leftJoinAndSelect("invitation.invited_by", "invited_by")
				.leftJoinAndSelect("invitation.user", "invited")
				.leftJoinAndSelect("invitation.channel", "channel"),
		);
	}

	in_invitation(userId: string) {
		this.query = this.query.andWhere(
			new Brackets((qb) =>
				qb.where("invited_by.id = :userId", { userId }).orWhere("invited.id = :userId", { userId }),
			),
		);
		return this;
	}

	invited(userId: string) {
		this.query = this.query.andWhere("invited.id = :userId", { userId });
		return this;
	}

	channel(channelId: number) {
		this.query = this.query.andWhere("channel.id = channelId", { channelId });
		return this;
	}
}
