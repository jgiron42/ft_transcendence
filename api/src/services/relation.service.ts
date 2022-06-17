import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Relation } from "@src/entities/relation.entity";
import { Container } from "typedi";
import { RelationQuery } from "@src/queries/relationQuery";

@Injectable()
export class RelationService {
	constructor(
		@InjectRepository(Relation)
		private RelationRepository: Repository<Relation>,
	) {
		Container.set(this.constructor, this);
	}

	getReq() {
		return new RelationQuery(this.RelationRepository);
	}

	findAll(userId: string, page = 1, itemByPage = 10): Promise<Relation[]> {
		return this.getReq().in_relation(userId).paginate(page, itemByPage).getMany();
	}

	findAllAndCount(userId: string, page = 1, itemByPage = 10): Promise<[Relation[], number]> {
		return this.getReq().in_relation(userId).paginate(page, itemByPage).getManyAndCount();
	}

	findOne(id: number): Promise<Relation> {
		return this.getReq().getOne(id);
	}

	async remove(id: number): Promise<void> {
		await this.getReq().remove(id);
	}

	create(relation: Relation): Promise<Relation> {
		return this.save(this.RelationRepository.create(relation));
	}

	async save(relation: Relation): Promise<Relation> {
		return await this.RelationRepository.save(relation);
	}

	update(id: number, relation: Relation) {
		return this.getReq().update(id, relation);
	}
	findByUser(id: string): Promise<Relation[]> {
		return this.getReq().in_relation(id).getMany();
	}
}
