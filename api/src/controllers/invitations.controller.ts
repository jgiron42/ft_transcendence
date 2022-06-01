import {Controller, Delete, Get, Param, UseGuards} from "@nestjs/common";
import {SessionGuard} from "@guards/session.guard";

@Controller("users")
@UseGuards(...SessionGuard)
export class InvitationsController {
	@Get()
	getAll(): Promise<object> {
		return Promise.resolve({ foo: "bar" });
	}

	@Get(":id")
	getOne(@Param("id") _id: string): Promise<object> {
		return Promise.resolve({ foo: "bar" });
	}

	@Delete(":id")
	removeInvitation(@Param("id") _id: string): Promise<object> {
		return Promise.resolve({ foo: "bar" });
	}
}
