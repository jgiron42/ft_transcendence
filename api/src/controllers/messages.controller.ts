import { Controller, Get, Param, ParseIntPipe, Req, Res, UseFilters, UseGuards, UseInterceptors } from "@nestjs/common";
import { MessageExistGuard } from "@src/guards/message-exist.guard";
import { SessionGuard } from "@guards/session.guard";
import { MessageService } from "@services/message.service";
import { CrudFilterInterceptor } from "@interceptors/crud-filter.interceptor";
import { Response } from "express";
import { Page } from "@utils/Page";
import { PerPage } from "@utils/PerPage";
import { TypeormErrorFilter } from "@filters/typeorm-error.filter";
import { Request } from "@src/types/request";

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
		@Page() page: number,
		@PerPage() per_page: number,
		@Res({ passthrough: true }) res: Response,
		@Req() req: Request,
	): Promise<object> {
		const [ret, total] = await this.messageService
			.getQuery()
			.see_message(req.user.id)
			.paginate(page, per_page)
			.getManyAndCount();
		res.setHeader("total_entities", total);
		res.setHeader("total_pages", Math.ceil(total / per_page));
		return ret;
	}

	/**
	 * get the message designated by id
	 */
	@Get(":id")
	@UseGuards(MessageExistGuard)
	getOne(@Param("id", ParseIntPipe) id: number, @Req() req: Request): Promise<object> {
		return this.messageService.getQuery().see_message(req.user.id).getOne(id);
	}
}
