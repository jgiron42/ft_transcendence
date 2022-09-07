import {
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	UseGuards,
	UseInterceptors,
	UseFilters,
	Post,
} from "@nestjs/common";
import { SessionGuard } from "@guards/session.guard";
import { CrudFilterInterceptor } from "@interceptors/crud-filter.interceptor";
import { Page } from "@utils/Page";
import { PerPage } from "@utils/PerPage";
import { TypeormErrorFilter } from "@filters/typeorm-error.filter";
import { ChanInvitationService } from "@services/chan_invitation.service";
import { ChanConnectionService } from "@services/chan_connection.service";
import { User } from "@src/entities/user.entity";
import { PaginatedResponse } from "@src/types/paginated-response";
import { ChanInvitation } from "@entities/chan_invitation.entity";
import { PaginationInterceptor } from "@interceptors/pagination.interceptor";
import { GetUser } from "@utils/get-user";

@Controller("invitations")
@UseGuards(...SessionGuard)
@UseInterceptors(CrudFilterInterceptor, PaginationInterceptor)
@UseFilters(TypeormErrorFilter)
export class InvitationsController {
	constructor(private chanInvitationService: ChanInvitationService, private chanConnection: ChanConnectionService) {}

	/**
	 * get all chan connections
	 */
	@Get()
	async getAll(
		@Page() page: number,
		@PerPage() per_page: number,
		@GetUser() user: User,
	): Promise<PaginatedResponse<ChanInvitation>> {
		return this.chanInvitationService.getQuery().in_invitation(user.id).paginate(page, per_page).getManyAndCount();
	}

	/**
	 * get the chanInvitation designated by id
	 */
	@Get(":id")
	getOne(@Param("id", ParseIntPipe) id: number, @GetUser() user: User): Promise<object> {
		return this.chanInvitationService.getQuery().in_invitation(user.id).getOneOrFail(id);
	}

	/**
	 * accept the invitation designated by id
	 */
	@Post(":id/accept")
	async accept(@Param("id", ParseIntPipe) id: number, @GetUser() user: User) {
		const invite = await this.chanInvitationService.getQuery().invited(user.id).getOneOrFail(id);
		await this.chanInvitationService.getQuery().remove(id);
		return this.chanConnection.create({ user: invite.user as User, channel: invite.channel });
	}

	/**
	 * delete the chanInvitation designated by id
	 */
	@Delete(":id")
	removeInvitation(@Param("id", ParseIntPipe) id: number, @GetUser() user: User) {
		return this.chanInvitationService.getQuery().in_invitation(user.id).remove(id);
	}
}
