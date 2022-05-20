import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { GameExistGuard } from "@src/guards/game-exist.guard";

@Controller("games")
export class GamesController {
	@Get()
	getAll(): Promise<object> {
		return Promise.resolve({ foo: "bar" });
	}

	@Get(":id")
	@UseGuards(GameExistGuard)
	getOne(@Param("id") _id: string): Promise<object> {
		return Promise.resolve({ foo: "bar" });
	}

	@Post()
	create(@Body() _game: any): Promise<object> {
		return Promise.resolve({ foo: "bar" });
	}
}
