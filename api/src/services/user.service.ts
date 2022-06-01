import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "@entities/user.entity";
import { UserCreation } from "@dtos/userCreation.dto";
import {Container} from "typedi";
import {TransformFnParams} from "class-transformer";

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>,
	) {Container.set(this.constructor, this)}

	findAll(): Promise<User[]> {
		return this.usersRepository.find();
	}

	findOne(id: string): Promise<User> {
		return this.usersRepository.findOne(id);
	}

	static findOne({value}: TransformFnParams): Promise<User>
	{
		if (!value)
			return undefined;
		return Container.get(UserService).findOne(value);
	}

	async remove(id: string): Promise<void> {
		await this.usersRepository.delete(id);
	}

	async create(user: UserCreation): Promise<User> {
		user.date_register = new Date();
		return this.usersRepository.save(user);
	}
}
