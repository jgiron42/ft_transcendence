import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Game } from "@src/entities/game.entity";
// import {User} from "@entities/user.entity";

@Injectable()
export class GameService {
	constructor(
		@InjectRepository(Game)
		private GameRepository: Repository<Game>,
	) {}

	findAll(): Promise<Game[]> {
		return this.GameRepository.find();
	}

	findOne(id: string): Promise<Game> {
		return this.GameRepository.findOne(id);
	}

	async remove(id: string): Promise<void> {
		await this.GameRepository.delete(id);
	}

	async create(game: Game): Promise<Game> {
		return this.GameRepository.save(game);
	}
}
