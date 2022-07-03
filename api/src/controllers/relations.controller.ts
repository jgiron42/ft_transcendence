import {
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Post,
	Req,
	UseFilters,
	UseGuards,
	UseInterceptors,
	UsePipes,
} from "@nestjs/common";
import { SessionGuard } from "@guards/session.guard";
import { RelationService } from "@services/relation.service";
import { getValidationPipe } from "@utils/getValidationPipe";
import { Relation, RelationType } from "@entities/relation.entity";
import { MyRequestPipe } from "@utils/myRequestPipe";
import { getPostPipeline } from "@utils/getPostPipeline";
import { CrudFilterInterceptor } from "@interceptors/crud-filter.interceptor";
import { Page } from "@utils/Page";
import { PerPage } from "@utils/PerPage";
import { TypeormErrorFilter } from "@filters/typeorm-error.filter";
import { Request } from "@src/types/request";
import { User } from "@entities/user.entity";
import { ValidationError } from "@src/exceptions/validationError.exception";
import { PaginatedResponse } from "@src/types/paginated-response";
import { PaginationInterceptor } from "@interceptors/pagination.interceptor";
import { DevelopmentGuard } from "@src/guards/development.guard";

@Controller("relations")
@UseGuards(...SessionGuard)
@UseInterceptors(CrudFilterInterceptor, PaginationInterceptor)
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
		@Req() req: Request,
	): Promise<PaginatedResponse<Relation>> {
		return await this.relationService.getReq().see_relation(req.user.id).paginate(page, per_page).getManyAndCount();
	}

	/**
	 * get the relation designated by id
	 */
	@Get(":id")
	getOne(@Param("id", ParseIntPipe) id: number, @Req() req: Request): Promise<object> {
		return this.relationService.getReq().see_relation(req.user.id).getOne(id);
	}

	/**
	 * create the relation designated by id
	 */
	@Post()
	@UsePipes(getValidationPipe(Relation))
	@UseGuards(DevelopmentGuard)
	create(@MyRequestPipe(...getPostPipeline(Relation)) relation: Relation, @Req() req: Request) {
		if ((relation.owner as User)?.id !== req.user.id)
			throw new ValidationError("user must be in relation creation");
		return this.relationService.create(relation);
	}

	/**
	 * create the relation designated by id
	 */
	@Post(":id/accept_friend")
	async accept(@Param("id", ParseIntPipe) id: number, @Req() req: Request) {
		await this.relationService
			.getReq()
			.target(req.user.id)
			.type(RelationType.FRIEND_REQUEST)
			.update(id, { type: RelationType.FRIEND });
	}

	/**
	 * delete the relation designated by id
	 */
	@Delete(":id")
	remove(@Param("id", ParseIntPipe) id: number, @Req() req: Request) {
		return this.relationService.getReq().see_relation(req.user.id).remove(id);
	}
}
