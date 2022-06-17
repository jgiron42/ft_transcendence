import {
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	UseGuards,
	UseInterceptors,
	Res,
	UseFilters,
	Req,
	Post,
} from "@nestjs/common";
import { SessionGuard } from "@guards/session.guard";
import { CrudFilterInterceptor } from "@interceptors/crud-filter.interceptor";
import { Response } from "express";
import { Page } from "@utils/Page";
import { PerPage } from "@utils/PerPage";
import { QueryFailedFilter } from "@filters/query-failed.filter";
import { Request } from "@src/types/request";
import { ChanInvitationService } from "@services/chan_invitation.service";
import { EntityNotFoundFilter } from "@filters/entity-not-found.filter";
import { ChanConnectionService } from "@services/chan_connection.service";
import { User } from "@src/entities/user.entity";

@Controller("users")
@UseGuards(...SessionGuard)
@UseInterceptors(CrudFilterInterceptor)
@UseFilters(QueryFailedFilter, EntityNotFoundFilter)
export class InvitationsController {
	constructor(private chanInvitationService: ChanInvitationService, private chanConnection: ChanConnectionService) {}

	/**
	 * get all chan connections
	 */
	@Get()
	async getAll(
		@Page() page: number,
		@PerPage() per_page: number,
		@Res({ passthrough: true }) res: Response,
		@Req() req: Request,
	): Promise<object> {
		const [ret, total] = await this.chanInvitationService
			.getQuery()
			.in_invitation(req.user.id)
			.paginate(page, per_page)
			.getManyAndCount();
		res.setHeader("total_entities", total);
		res.setHeader("total_pages", Math.ceil(total / per_page));
		return ret;
	}

	/**
	 * get the chanInvitation designated by id
	 */
	@Get(":id")
	getOne(@Param("id", ParseIntPipe) id: number, @Req() req: Request): Promise<object> {
		return this.chanInvitationService.getQuery().in_invitation(req.user.id).getOne(id);
	}

	/**
	 * accept the invitation designated by id
	 * @param id
	 * @param req
	 */
	@Post(":id/accept")
	async accept(@Param("id", ParseIntPipe) id: number, @Req() req: Request) {
		const invite = await this.chanInvitationService.getQuery().invited(req.user.id).getOneOrFail(id);
		await this.chanInvitationService.getQuery().remove(id);
		return this.chanConnection.create({ user_id: invite.invited as User, chan_id: invite.invite_where });
	}

	/**
	 * delete the chanInvitation designated by id
	 */
	@Delete(":id")
	removeInvitation(@Param("id", ParseIntPipe) id: number, @Req() req: Request) {
		return this.chanInvitationService.getQuery().in_invitation(req.user.id).remove(id);
	}
}
