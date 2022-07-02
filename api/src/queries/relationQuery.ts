import { Brackets, Repository } from "typeorm";
import { QueryCooker } from "@src/queries/QueryCooker";
import { Relation, RelationType } from "@src/entities/relation.entity";

export class RelationQuery extends QueryCooker<Relation> {
	constructor(entityRepository: Repository<Relation>) {
		super(
			entityRepository,
			entityRepository
				.createQueryBuilder("relation")
				.leftJoinAndSelect("relation.owner", "owner")
				.leftJoinAndSelect("relation.target", "target"),
		);
	}

	/**
	 * select only the relations in which userId is
	 */
	in_relation(userId: string) {
		this.query = this.query.andWhere(
			new Brackets((qb) =>
				qb
					.where("owner.id = :userId1", { userId1: userId })
					.orWhere("target.id = :userId2", { userId2: userId }),
			),
		);
		return this;
	}

	/**
	 * select only the relations in visible by userId
	 */
	see_relation(userId: string) {
		this.query = this.query.andWhere(
			new Brackets((qb) =>
				qb
					.where("owner.id = :userId3", { userId3: userId })
					.orWhere("relation.type <> :type2", { type2: RelationType.BLOCK }),
			),
		);
		return this;
	}

	/**
	 * select only the relations where the targert is userId
	 */
	target(userId: string) {
		this.query = this.query.andWhere("target.id = :userId4", { userId4: userId });
		return this;
	}

	/**
	 * select only the relations owned by userId
	 */
	owner(userId: string) {
		this.query = this.query.andWhere("owner.id = :userId5", { userId5: userId });
		return this;
	}

	/**
	 * select only the relations of type type
	 */
	type(type: RelationType) {
		this.query = this.query.andWhere("relation.type = :type", { type });
		return this;
	}
}
