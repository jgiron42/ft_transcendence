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
import { TypeormErrorFilter } from "@filters/typeorm-error.filter";
import { Request } from "@src/types/request";
import { User } from "@entities/user.entity";
import { ValidationError } from "@src/exceptions/validationError.exception";

@Controller("relations")
@UseGuards(...SessionGuard)
@UseInterceptors(CrudFilterInterceptor)
@UseFilters(TypeormErrorFilter)
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
	 */
	@Post()
	@UsePipes(getValidationPipe(Relation))
	create(@MyRequestPipe(...getPostPipeline(Relation)) relation: Relation, @Req() req: Request) {
		if ((relation.user_one as User)?.id !== req.user.id && (relation.user_two as User)?.id !== req.user.id)
			throw new ValidationError("user must be in relation creation");
		return this.relationService.create(relation);
	}

	/**
	 * delete the relation designated by id
	 */
	@Delete(":id")
	remove(@Param("id", ParseIntPipe) id: number, @Req() req: Request) {
		return this.relationService.getReq().in_relation(req.user.id).remove(id);
	}
}
