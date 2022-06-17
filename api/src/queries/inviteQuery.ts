import { Brackets, Repository } from "typeorm";
import { QueryCooker } from "@src/queries/QueryCooker";
import { ChanInvitation } from "@entities/chan_invitation.entity";

export class InviteQuery extends QueryCooker<ChanInvitation> {
	constructor(entityRepository: Repository<ChanInvitation>) {
		super(
			entityRepository,
			entityRepository
				.createQueryBuilder("invitation")
				.leftJoinAndSelect("invitation.invite_by", "invite_by")
				.leftJoinAndSelect("invitation.invited", "invited")
				.leftJoinAndSelect("invitation.invited_where", "channel"),
		);
	}

	in_invitation(userId: string) {
		this.query = this.query.andWhere(
			new Brackets((qb) =>
				qb.where("invite_by.id = :userId", { userId }).orWhere("invited.id = :userId", { userId }),
			),
		);
		return this;
	}

	invited(userId: string) {
		this.query = this.query.andWhere("invited.id = :userId", { userId });
		return this;
	}

	channel(chanId: number) {
		this.query = this.query.andWhere("channel.id = chanId", { chanId });
		return this;
	}
}
