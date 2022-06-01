import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Game } from "@src/entities/game.entity";
import {Container} from "typedi";

@Injectable()
export class GameService {
	constructor(
		@InjectRepository(Game)
		private GameRepository: Repository<Game>,
	) {Container.set(this.constructor, this)}

	findAll(): Promise<Game[]> {
		return this.GameRepository.find();
	}

	findOne(id: string): Promise<Game> {
		return this.GameRepository.findOne(id);
	}

	async remove(id: string): Promise<void> {
		await this.GameRepository.delete(id);
	}

	async findByUser(id: string): Promise<Game[]> {
		return this.GameRepository.find({ where: [{ first_player: id }, { second_player: id }] });
	}

	async create(game: Game): Promise<Game> {
		return this.GameRepository.save(game);
	}
}
