import { Controller, Get, Param, ParseIntPipe, UseFilters, UseGuards, UseInterceptors } from "@nestjs/common";
import { MessageExistGuard } from "@src/guards/message-exist.guard";
import { SessionGuard } from "@guards/session.guard";
import { MessageService } from "@services/message.service";
import { CrudFilterInterceptor } from "@interceptors/crud-filter.interceptor";
import { Page } from "@utils/Page";
import { Date as myDate } from "@utils/Date";
import { PerPage } from "@utils/PerPage";
import { TypeormErrorFilter } from "@filters/typeorm-error.filter";
import { PaginatedResponse } from "@src/types/paginated-response";
import { Message } from "@entities/message.entity";
import { User } from "@entities/user.entity";
import { GetUser } from "@utils/get-user";

@Controller("messages")
@UseGuards(...SessionGuard)
@UseInterceptors(CrudFilterInterceptor)
@UseFilters(TypeormErrorFilter)
export class MessagesController {
	constructor(private messageService: MessageService) {}

	/**
	 * get all messages
	 */
	@Get()
	async getAll(
		@myDate() date: Date,
		@Page() page: number,
		@PerPage() per_page: number,
		@GetUser() user: User,
	): Promise<PaginatedResponse<Message>> {
		return this.messageService
			.getQuery()
			.see_message(user.id)
			.paginate(date ?? page, per_page)
			.getManyAndCount();
	}

	/**
	 * get the message designated by id
	 */
	@Get(":id")
	@UseGuards(MessageExistGuard)
	getOne(@Param("id", ParseIntPipe) id: number, @GetUser() user: User): Promise<object> {
		return this.messageService.getQuery().see_message(user.id).getOne(id);
	}
}
