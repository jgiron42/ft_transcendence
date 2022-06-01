import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "@entities/user.entity";

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>,
	) {}

	findAll(): Promise<User[]> {
		return this.usersRepository.find();
	}

	findOne(id: string): Promise<User> {
		return this.usersRepository.findOne(id);
	}

	async findByUid(id: string): Promise<User> {
		return (await this.usersRepository.find({ where: { pseudo: id } }))[0];
	}

	async remove(id: string): Promise<void> {
		await this.usersRepository.delete(id);
	}

	async create(user: User): Promise<User> {
		return this.usersRepository.save(user);
	}

	async update(id: number, user: User): Promise<User> {
		await this.usersRepository.update(id, user);
		return this.usersRepository.findOne(id);
	}
}
