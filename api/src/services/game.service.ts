import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Game } from "@src/entities/game.entity";
import { Container } from "typedi";
import { GameQuery } from "@src/queries/gameQuery";

@Injectable()
export class GameService {
	constructor(
		@InjectRepository(Game)
		private GameRepository: Repository<Game>,
	) {
		Container.set(this.constructor, this);
	}

	getQuery() {
		return new GameQuery(this.GameRepository);
	}

	findAll(page = 1, itemByPage = 10): Promise<Game[]> {
		return this.getQuery().paginate(page, itemByPage).getMany();
	}

	findOne(id: number): Promise<Game> {
		return this.getQuery().getOne(id);
	}

	async remove(id: number) {
		return this.getQuery().remove(id);
	}

	async findByUser(id: string): Promise<Game[]> {
		return this.getQuery().in_game(id).getMany();
	}

	create(channel: Game): Promise<Game> {
		return this.save(this.GameRepository.create(channel));
	}

	async save(channel: Game): Promise<Game> {
		return await this.GameRepository.save(channel);
	}

	update(id: number, game: Game) {
		return this.getQuery().update(id, game);
	}
}
