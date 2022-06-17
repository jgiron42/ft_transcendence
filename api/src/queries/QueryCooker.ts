import { Repository, SelectQueryBuilder } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { EntityInterface } from "@src/types/entityInterface";

export class QueryCooker<Entity extends EntityInterface> {
	constructor(private entityRepository: Repository<Entity>, public query: SelectQueryBuilder<Entity>) {}

	paginate(page = 1, itemByPage = 10) {
		this.query = this.query.skip((page - 1) * itemByPage).limit(itemByPage);
		return this;
	}

	getMany(): Promise<Entity[]> {
		return this.query.getMany();
	}

	getManyAndCount(): Promise<[Entity[], number]> {
		return this.query.getManyAndCount();
	}

	getOne(id: Entity["id"]): Promise<Entity> {
		return this.query.andWhere({ id }).getOne();
	}

	getOneOrFail(id: Entity["id"]): Promise<Entity> {
		return this.query.andWhere({ id }).getOneOrFail();
	}

	async update(id: Entity["id"], value: QueryDeepPartialEntity<Entity>) {
		return this.entityRepository.update(await this.getOneOrFail(id), value);
	}

	async remove(id: Entity["id"]) {
		return this.entityRepository.remove(await this.getOneOrFail(id));
	}
}
