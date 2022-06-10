import { Controller, Get, Param, UseGuards, UseInterceptors } from "@nestjs/common";
import { MessageExistGuard } from "@src/guards/message-exist.guard";
import { SessionGuard } from "@guards/session.guard";
import { MessageService } from "@services/message.service";
import { CrudFilterInterceptor } from "@interceptors/crud-filter.interceptor";

@Controller("messages")
@UseGuards(...SessionGuard)
@UseInterceptors(CrudFilterInterceptor)
export class MessagesController {
	constructor(private messageService: MessageService) {}

	/**
	 * get all messages TODO: visible by a specific user
	 */
	@Get()
	getAll(): Promise<object> {
		return this.messageService.findAll(); // TODO: protect
	}

	/**
	 * get the message designated by id
	 * @param id the message id
	 */
	@Get(":id")
	@UseGuards(MessageExistGuard)
	getOne(@Param("id") id: string): Promise<object> {
		return this.messageService.findOne(id); // TODO: protect
	}
}
