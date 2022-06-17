import { Brackets, Repository } from "typeorm";
import { QueryCooker } from "@src/queries/QueryCooker";
import { Relation } from "@src/entities/relation.entity";

export class RelationQuery extends QueryCooker<Relation> {
	constructor(entityRepository: Repository<Relation>) {
		super(
			entityRepository,
			entityRepository
				.createQueryBuilder("relation")
				.leftJoinAndSelect("relation.user_one", "user_one")
				.leftJoinAndSelect("relation.user_two", "user_two"),
		);
	}

	in_relation(userId: string) {
		this.query = this.query.andWhere(
			new Brackets((qb) =>
				qb.where("user_one.id = :userId", { userId }).orWhere("user_two.id = :userId", { userId }),
			),
		);
		return this;
	}
}
