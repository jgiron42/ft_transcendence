import { Repository } from "typeorm";
import { QueryCooker } from "@src/queries/QueryCooker";
import { User } from "@entities/user.entity";

export class UserQuery extends QueryCooker<User> {
	constructor(entityRepository: Repository<User>) {
		super(entityRepository, entityRepository.createQueryBuilder("user"));
	}

	is(userId: string) {
		this.query = this.query.where("user.id = :userId", { userId });
		return this;
	}
}
