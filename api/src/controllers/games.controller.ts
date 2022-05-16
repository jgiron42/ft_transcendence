import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";

@Controller("games")
export class GamesController {
	@Get()
	getAll(): Promise<object> {
		return Promise.resolve({ foo: "bar" });
	}

	@Get(":id")
	getOne(@Param("id") _id: string): Promise<object> {
		return Promise.resolve({ foo: "bar" });
	}

	@Post(":id")
	create(@Param("id") _id: string, @Body() _game: any): Promise<object> {
		return Promise.resolve({ foo: "bar" });
	}

	@Put(":id")
	update(@Param("id") _id: string, @Body() _update: any): Promise<object> {
		return Promise.resolve({ foo: "bar" });
	}
}
