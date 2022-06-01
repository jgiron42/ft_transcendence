import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Game } from "@src/entities/game.entity";

@Injectable()
export class GameService {
	constructor(
		@InjectRepository(Game)
		private GameRepository: Repository<Game>,
	) {}

	findAll(): Promise<Game[]> {
		return this.GameRepository.find();
	}

	findOne(id: number): Promise<Game> {
		return this.GameRepository.findOne({ where: { id } });
	}

	async remove(id: string): Promise<void> {
		await this.GameRepository.delete(id);
	}

	async create(game: Game): Promise<Game> {
		return this.GameRepository.save(game);
	}
}
