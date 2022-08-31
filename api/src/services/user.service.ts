import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "@entities/user.entity";
import { Container } from "typedi";
import { resourceService } from "@src/types/resource-service";
import { UserQuery } from "@src/queries/userQuery";
import { PaginatedResponse } from "@src/types/paginated-response";
import { DeepPartial } from "typeorm/common/DeepPartial";

@Injectable()
export class UserService implements resourceService<User> {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>,
	) {
		Container.set(this.constructor, this);
	}

	getQuery() {
		return new UserQuery(this.usersRepository);
	}

	async complete(str: string): Promise<User[]> {
		return await this.usersRepository
			.createQueryBuilder("user")
			.where("id LIKE :str", { str: `${str}%` })
			.take(10)
			.orderBy("id", "ASC")
			.getMany();
	}

	findAll(page = 1, itemByPage = 10): Promise<User[]> {
		return this.getQuery().paginate(page, itemByPage).getMany();
	}
	findAllAndCount(page = 1, itemByPage = 10): Promise<PaginatedResponse<User>> {
		return this.getQuery().paginate(page, itemByPage).getManyAndCount();
	}

	findOne(id: string): Promise<User> {
		return this.getQuery().getOne(id);
	}

	async remove(id: string): Promise<void> {
		await this.getQuery().remove(id);
	}

	async create(userPartial: DeepPartial<User>): Promise<User> {
		const user: User = this.usersRepository.create(userPartial);
		await this.usersRepository.insert(user);
		return user;
	}

	async save(user: User): Promise<User> {
		return await this.usersRepository.save(user);
	}
}
