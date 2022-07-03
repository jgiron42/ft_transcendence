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

	/**
	 * select only the invitations to and from userId
	 */
	in_invitation(userId: string) {
		this.query = this.query.andWhere(
			new Brackets((qb) =>
				qb.where("invited_by.id = :userId", { userId }).orWhere("invited.id = :userId", { userId }),
			),
		);
		return this;
	}

	/**
	 * select only the invitations to userId
	 */
	invited(userId: string) {
		this.query = this.query.andWhere("invited.id = :userId2", { userId2: userId });
		return this;
	}

	/**
	 * select only the invitations from userId
	 */
	channel(channelId: number) {
		this.query = this.query.andWhere("channel.id = channelId", { channelId });
		return this;
	}
}
