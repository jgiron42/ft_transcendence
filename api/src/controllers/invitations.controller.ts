import { Controller, Delete, Get, Param, UseGuards } from "@nestjs/common";
import { SessionGuard } from "@guards/session.guard";
import { ChanConnectionService } from "@services/chan_connection.service";

@Controller("users")
@UseGuards(...SessionGuard)
export class InvitationsController {
	@Get()
	getAll(): Promise<object> {
		return this.chanConnectionService.findAll();
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
