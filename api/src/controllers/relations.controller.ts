import {Body, Controller, Delete, Get, Param, Post, UseGuards} from "@nestjs/common";
import {SessionGuard} from "@guards/session.guard";

@Controller("relations")
@UseGuards(...SessionGuard)
export class RelationsController {
	@Get()
	getAll(): Promise<object> {
		return Promise.resolve({ foo: "bar" });
	}

	@Get(":id")
	getOne(@Param("id") _id: string): Promise<object> {
		return Promise.resolve({ foo: "bar" });
	}

	@Post()
	create(@Param("id") _id: string, @Body() _relation: any): Promise<object> {
		return Promise.resolve({ foo: "bar" });
	}

	@Delete(":id")
	remove(@Param("id") _id: string): Promise<object> {
		return Promise.resolve({ foo: "bar" });
	}
}
