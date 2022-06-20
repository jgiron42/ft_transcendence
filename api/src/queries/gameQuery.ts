import { Brackets, Repository } from "typeorm";
import { QueryCooker } from "@src/queries/QueryCooker";
import { Game } from "@entities/game.entity";

export class GameQuery extends QueryCooker<Game> {
	constructor(entityRepository: Repository<Game>) {
		super(
			entityRepository,
			entityRepository
				.createQueryBuilder("game")
				.leftJoinAndSelect("game.first_player", "user_one")
				.leftJoinAndSelect("game.second_player", "user_two"),
		);
	}

	in_game(userId: string) {
		this.query = this.query.andWhere(
			new Brackets((qb) =>
				qb.where("user_one.id = :userId", { userId }).orWhere("user_two.id = :userId", { userId }),
			),
		);
		return this;
	}
}