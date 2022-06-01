import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { MessageExistGuard } from "@src/guards/message-exist.guard";
import {SessionGuard} from "@guards/session.guard";

@Controller("messages")
@UseGuards(...SessionGuard)
export class MessagesController {
	@Get()
	getAll(): Promise<object> {
		return Promise.resolve({ foo: "bar" });
	}

	@Get(":id")
	@UseGuards(MessageExistGuard)
	getOne(@Param("id") _id: string): Promise<object> {
		return Promise.resolve({ foo: "bar" });
	}
}
