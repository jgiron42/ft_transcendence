import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { MessageExistGuard } from "@src/guards/message-exist.guard";
import { SessionGuard } from "@guards/session.guard";
import { MessageService } from "@services/message.service";

@Controller("messages")
@UseGuards(...SessionGuard)
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
