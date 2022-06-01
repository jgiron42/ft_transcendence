import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Relation } from "@src/entities/relation.entity";

@Injectable()
export class RelationService {
	constructor(
		@InjectRepository(Relation)
		private RelationRepository: Repository<Relation>,
	) {}

	findAll(): Promise<Relation[]> {
		return this.RelationRepository.find();
	}

	findOne(id: number): Promise<Relation> {
		return this.RelationRepository.findOne({ where: { id } });
	}

	async remove(id: string): Promise<void> {
		await this.RelationRepository.delete(id);
	}

	async create(relation: Relation): Promise<Relation> {
		return this.RelationRepository.save(relation);
	}
}
