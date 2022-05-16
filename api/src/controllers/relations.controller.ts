import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";

@Controller("relations")
export class RelationsController {
	@Get()
	getAll(): Promise<object> {
		return Promise.resolve({ foo: "bar" });
	}

	@Get(":id")
	getOne(@Param("id") _id: string): Promise<object> {
		return Promise.resolve({ foo: "bar" });
	}

	@Post(":id")
	create(@Param("id") _id: string, @Body() _relation: any): Promise<object> {
		return Promise.resolve({ foo: "bar" });
	}

	@Delete(":id")
	remove(@Param("id") _id: string): Promise<object> {
		return Promise.resolve({ foo: "bar" });
	}
}
