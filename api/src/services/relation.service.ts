import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Relation } from "@src/entities/relation.entity";
import { Container } from "typedi";
import { RelationQuery } from "@src/queries/relationQuery";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { DeepPartial } from "typeorm/common/DeepPartial";

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

	findOne(id: number): Promise<Relation> {
		return this.getReq().getOne(id);
	}

	async remove(id: number): Promise<void> {
		await this.getReq().remove(id);
	}

	create(relation: DeepPartial<Relation>) {
		return this.getReq().create(relation);
	}

	async save(relation: Relation): Promise<Relation> {
		return await this.RelationRepository.save(relation);
	}

	update(id: number, relation: QueryDeepPartialEntity<Relation>) {
		return this.getReq().update(relation, id);
	}
	findByUser(id: string): Promise<Relation[]> {
		return this.getReq().in_relation(id).getMany();
	}
}
