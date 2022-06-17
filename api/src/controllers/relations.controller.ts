import {
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Post,
	Req,
	Res,
	UseFilters,
	UseGuards,
	UseInterceptors,
	UsePipes,
} from "@nestjs/common";
import { SessionGuard } from "@guards/session.guard";
import { RelationService } from "@services/relation.service";
import { getValidationPipe } from "@utils/getValidationPipe";
import { Relation } from "@entities/relation.entity";
import { MyRequestPipe } from "@utils/myRequestPipe";
import { getPostPipeline } from "@utils/getPostPipeline";
import { CrudFilterInterceptor } from "@interceptors/crud-filter.interceptor";
import { Response } from "express";
import { Page } from "@utils/Page";
import { PerPage } from "@utils/PerPage";
import { QueryFailedFilter } from "@filters/query-failed.filter";
import { Request } from "@src/types/request";
import { Groups } from "@utils/groupsDecorator";
import { EntityNotFoundFilter } from "@filters/entity-not-found.filter";

@Controller("relations")
@UseGuards(...SessionGuard)
@UseInterceptors(CrudFilterInterceptor)
@UseFilters(QueryFailedFilter, EntityNotFoundFilter)
export class RelationsController {
	constructor(private relationService: RelationService) {}

	/**
	 * get all relations
	 */
	@Get()
	async getAll(
		@Page() page: number,
		@PerPage() per_page: number,
		@Res({ passthrough: true }) res: Response,
		@Req() req: Request,
	): Promise<object> {
		const [ret, total] = await this.relationService
			.getReq()
			.in_relation(req.user.id)
			.paginate(page, per_page)
			.getManyAndCount();
		res.setHeader("total_entities", total);
		res.setHeader("total_pages", Math.ceil(total / per_page));
		return ret;
	}

	/**
	 * get the relation designated by id
	 */
	@Get(":id")
	getOne(@Param("id", ParseIntPipe) id: number, @Req() req: Request): Promise<object> {
		return this.relationService.getReq().in_relation(req.user.id).getOne(id);
	}

	/**
	 * create the relation designated by id
	 * @param relation
	 */
	@Post()
	@UsePipes(getValidationPipe(Relation))
	@Groups("in_relation_creation")
	create(@MyRequestPipe(...getPostPipeline(Relation)) relation: Relation) {
		return this.relationService.create(relation); // TODO: protect
	}

	/**
	 * delete the relation designated by id
	 */
	@Delete(":id")
	remove(@Param("id", ParseIntPipe) id: number, @Req() req: Request) {
		return this.relationService.getReq().in_relation(req.user.id).remove(id);
	}
}
