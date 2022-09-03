import { Repository, SelectQueryBuilder } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { EntityInterface } from "@src/types/entityInterface";
import { PaginatedResponse } from "@src/types/paginated-response";
import { DeepPartial } from "typeorm/common/DeepPartial";
import { UpdateResult } from "typeorm/query-builder/result/UpdateResult";

function* idGen(prefix = "id"): Generator<string, string, boolean> {
	let i = 0;
	while (true) if (!(yield `${prefix}${i}`)) i++;
}

/**
 * wrapper of Repository and SelectQueryBuilder Used to provide a better interface to typeorm. this class is specially
 * designed to be extended by another class that provide methods to apply filters by editing the query property. (eg: MessageQuery)
 */
export class QueryCooker<Entity extends EntityInterface> {
	private per_page: number;
	private getid: Generator<string, string, boolean>;

	protected get newId(): string {
		return this.getid.next().value;
	}

	protected get currentId(): string {
		// tell getid to reuse the same id
		return this.getid.next(true).value;
	}

	constructor(
		private entityRepository: Repository<Entity>,
		public query: SelectQueryBuilder<Entity>,
		private alias = "entity",
	) {
		this.getid = idGen("generatedId");
	}

	sort(sort: string, order?: "ASC" | "DESC", nulls?: "NULLS FIRST" | "NULLS LAST") {
		this.query = this.query.orderBy(sort, order, nulls);
		return this;
	}

	paginate(page: number | Date = 1, itemByPage = 10) {
		if (page instanceof Date) {
			this.per_page = itemByPage;
			this.query = this.query
				.andWhere(`${this.alias}.created_at < :cursor_date`, { cursor_date: page })
				.take(itemByPage);
		} else {
			this.per_page = itemByPage;
			this.query = this.query.skip((page - 1) * itemByPage).take(itemByPage);
		}
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

	async update(value: QueryDeepPartialEntity<Entity>, id?: Entity["id"]): Promise<UpdateResult> {
		return this.entityRepository.update({ id: (await this.getOneOrFail(id)).id as Entity["id"] }, value);
	}

	async updateWithSave(value: QueryDeepPartialEntity<Entity>, id?: Entity["id"]): Promise<Entity> {
		const val: Entity = await this.getOneOrFail(id);
		Object.assign(val, value);
		return this.entityRepository.save(val);
	}

	async create(value: DeepPartial<Entity>) {
		return await this.entityRepository.save(this.entityRepository.create(value));
	}

	async findOrCreate(value: DeepPartial<Entity>) {
		// TODO: redo this method
		return (
			(await this.entityRepository.findOneBy(value)) ??
			(await this.entityRepository.save(this.entityRepository.create(value)))
		);
	}

	async remove(id?: Entity["id"]) {
		return await this.entityRepository.remove(await this.getOneOrFail(id));
	}
}
