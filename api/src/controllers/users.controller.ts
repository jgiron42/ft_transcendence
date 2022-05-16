import { Body, Controller, Get, Param, Put } from "@nestjs/common";

@Controller("users")
export class UsersController {
	@Get()
	getAll(): Promise<object> {
		return Promise.resolve({ foo: "bar" });
	}

	@Get(":id")
	getOne(@Param("id") _id: string): Promise<object> {
		return Promise.resolve({ foo: "bar" });
	}

	@Put(":id")
	update(@Param("id") _id: string, @Body() _update: any): Promise<object> {
		return Promise.resolve({ foo: "bar" });
	}

	@Get(":id/games")
	getGames(@Param("id") _id: string): Promise<object> {
		return Promise.resolve({ foo: "bar" });
	}

	@Get(":id/relations")
	getRelations(@Param("id") _id: string): Promise<object> {
		return Promise.resolve({ foo: "bar" });
	}

	@Get(":id/chan_connections")
	getChanConnections(@Param("id") _id: string): Promise<object> {
		return Promise.resolve({ foo: "bar" });
	}

	@Get(":id/messages")
	getMessages(@Param("id") _id: string): Promise<object> {
		return Promise.resolve({ foo: "bar" });
	}
}
