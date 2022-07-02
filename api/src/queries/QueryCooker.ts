import { Repository, SelectQueryBuilder } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { EntityInterface } from "@src/types/entityInterface";
import { PaginatedResponse } from "@src/types/paginated-response";
import { DeepPartial } from "typeorm/common/DeepPartial";

/**
 * wrapper of Repository and SelectQueryBuilder Used to provide a better interface to typeorm. this class is specially
 * designed to be extended by another class that provide methods to apply filters by editing the query property. (eg: MessageQuery)
 */
export class QueryCooker<Entity extends EntityInterface> {
	private per_page: number;

	constructor(private entityRepository: Repository<Entity>, public query: SelectQueryBuilder<Entity>) {}

	paginate(page = 1, itemByPage = 10) {
		this.per_page = itemByPage;
		this.query = this.query.skip((page - 1) * itemByPage).limit(itemByPage);
		return this;
	}

	getMany(): Promise<Entity[]> {
		return this.query.getMany();
	}

	async getManyAndCount(page?: number, itemByPage?: number): Promise<PaginatedResponse<Entity>> {
		if (page) this.paginate(page, itemByPage);
		const [ret, total]: [Entity[], number] = await this.query.getManyAndCount();
		return { data: ret, per_page: this.per_page, entities: total, page: Math.ceil(total / this.per_page) };
	}

	getOne(id?: Entity["id"]): Promise<Entity> {
		if (id) this.query = this.query.andWhereInIds(id);
		return this.query.getOne();
	}

	getOneOrFail(id?: Entity["id"]): Promise<Entity> {
		if (id) this.query = this.query.andWhereInIds(id);
		return this.query.getOneOrFail();
	}

	async update(id: Entity["id"], value: QueryDeepPartialEntity<Entity>) {
		return this.entityRepository.update(await this.getOneOrFail(id), value);
	}

	async create(value: DeepPartial<Entity>) {
		return await this.entityRepository.save(this.entityRepository.create(value));
	}

	async remove(id: Entity["id"]) {
		return this.entityRepository.remove(await this.getOneOrFail(id));
	}
}
