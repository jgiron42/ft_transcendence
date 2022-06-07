import { Controller, Delete, Get, Param, Post, UseGuards, UsePipes } from "@nestjs/common";
import { SessionGuard } from "@guards/session.guard";
import { RelationService } from "@services/relation.service";
import { getValidationPipe } from "@utils/getValidationPipe";
import { Relation } from "@entities/relation.entity";
import { RequestPipeDecorator } from "@utils/requestPipeDecorator";
import { getPostPipe } from "@utils/getPostPipe";

@Controller("relations")
@UseGuards(...SessionGuard)
export class RelationsController {
	constructor(private relationService: RelationService) {}

	/**
	 * get all relations
	 */
	@Get()
	getAll(): Promise<object> {
		return Promise.resolve({ foo: "bar" });
	}

	@Get(":id")
	getOne(@Param("id") id: string): Promise<object> {
		return this.relationService.findOne(id); // TODO: protect
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
