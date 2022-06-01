import { Injectable } from "@nestjs/common";
import { User } from "@entities/user.entity";

@Injectable()
export class ChatService {
	private users: User[] = [];

	async findAll(): Promise<User[]> {
		return new Promise((resolve) => resolve(this.users));
	}

	async findOne(id: string): Promise<User> {
		return new Promise((resolve) => resolve(this.users.find((user) => user.totp_key === id)));
	}

	async addUser(user: User): Promise<User> {
		this.users.push(user);
		return new Promise((resolve) => resolve(user));
	}

	async deleteUser(id: string): Promise<User> {
		const user = this.users.find((u) => u.totp_key === id);
		this.users = this.users.filter((u) => u.totp_key !== id);
		return new Promise((resolve) => resolve(user));
	}
}
