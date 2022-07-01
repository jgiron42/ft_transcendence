import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "@entities/user.entity";
import { Container } from "typedi";
import { resourceService } from "@src/types/resource-service";
import { UserQuery } from "@src/queries/userQuery";

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

	findAll(page = 1, itemByPage = 10): Promise<User[]> {
		return this.getQuery().paginate(page, itemByPage).getMany();
	}
	findAllAndCount(page = 1, itemByPage = 10): Promise<[User[], number]> {
		return this.getQuery().paginate(page, itemByPage).getManyAndCount();
	}

	findOne(id: string): Promise<User> {
		return this.getQuery().getOne(id);
	}

	async remove(id: string): Promise<void> {
		await this.getQuery().remove(id);
	}

	async create(user: User) {
		user = this.usersRepository.create(user);
		await this.usersRepository.insert(user);
		return user;
	}

	async save(user: User): Promise<User> {
		return await this.usersRepository.save(user);
	}

	update(id: string, user: User) {
		return this.getQuery().update(id, user);
	}
}
