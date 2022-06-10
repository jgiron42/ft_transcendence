import { Controller, Delete, Get, Param, Post, UseGuards, UseInterceptors, UsePipes } from "@nestjs/common";
import { SessionGuard } from "@guards/session.guard";
import { RelationService } from "@services/relation.service";
import { getValidationPipe } from "@utils/getValidationPipe";
import { Relation } from "@entities/relation.entity";
import { RequestPipeDecorator } from "@utils/requestPipeDecorator";
import { getPostPipeline } from "@utils/getPostPipeline";
import { CrudFilterInterceptor } from "@interceptors/crud-filter.interceptor";

@Controller("relations")
@UseGuards(...SessionGuard)
@UseInterceptors(CrudFilterInterceptor)
export class RelationsController {
	constructor(private relationService: RelationService) {}

	/**
	 * get all relations
	 */
	@Get()
	getAll(): Promise<object> {
		return this.relationService.findAll(); // TODO: protect
	}

	/**
	 * get the relation designated by id
	 * @param id
	 */
	@Get(":id")
	getOne(@Param("id") id: string): Promise<object> {
		return this.relationService.findOne(id); // TODO: protect
	}

	/**
	 * create the relation designated by id
	 * @param relation
	 */
	@Post()
	@UsePipes(getValidationPipe(Relation))
	create(@RequestPipeDecorator(...getPostPipeline(Relation)) relation: Relation): Promise<object> {
		return this.relationService.create(relation); // TODO: protect
	}

	/**
	 * delete the relation designated by id
	 * @param id
	 */
	@Delete(":id")
	remove(@Param("id") id: string): Promise<void> {
		return this.relationService.remove(id); // TODO: protect
	}
}
