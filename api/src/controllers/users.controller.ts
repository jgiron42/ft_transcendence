import { Body, Controller, Get, Param, Put, UseGuards } from "@nestjs/common";
import { UserExistGuard } from "@guards/user-exist.guard";
import { IsUserGuard } from "@guards/is-user.guard";

@Controller("users")
export class UsersController {
	@Get()
	getAll(): Promise<object> {
		return Promise.resolve({ foo: "bar" });
	}

	@Get(":id")
	@UseGuards(UserExistGuard)
	getOne(@Param("id") _id: string): Promise<object> {
		return Promise.resolve({ foo: "bar" });
	}

	@Put(":id")
	@UseGuards(UserExistGuard, IsUserGuard)
	update(@Param("id") _id: string, @Body() _update: any): Promise<object> {
		return Promise.resolve({ foo: "bar" });
	}

	@Get(":id/games")
	@UseGuards(UserExistGuard)
	getGames(@Param("id") _id: string): Promise<object> {
		return Promise.resolve({ foo: "bar" });
	}

	@Get(":id/relations")
	@UseGuards(UserExistGuard)
	getRelations(@Param("id") _id: string): Promise<object> {
		return Promise.resolve({ foo: "bar" });
	}

	@Get(":id/chan_connections")
	@UseGuards(UserExistGuard)
	getChanConnections(@Param("id") _id: string): Promise<object> {
		return Promise.resolve({ foo: "bar" });
	}

	@Get(":id/messages")
	@UseGuards(UserExistGuard)
	getMessages(@Param("id") _id: string): Promise<object> {
		return Promise.resolve({ foo: "bar" });
	}
}
