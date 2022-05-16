import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";

@Controller("channels")
export class ChannelsController {
	@Get()
	getAll(): Promise<object> {
		return Promise.resolve({ foo: "bar" });
	}

	@Get(":id")
	getOne(@Param("id") _id: string): Promise<object> {
		return Promise.resolve({ foo: "bar" });
	}

	@Post(":id")
	create(@Param("id") _id: string, @Body() _channel: any): Promise<object> {
		return Promise.resolve({ foo: "bar" });
	}

	@Put(":id")
	update(@Param("id") _id: string, @Body() _update: any): Promise<object> {
		return Promise.resolve({ foo: "bar" });
	}

	@Delete(":id")
	remove(@Param("id") _id: string): Promise<object> {
		return Promise.resolve({ foo: "bar" });
	}

	@Get(":id/chan_connections")
	getConnections(@Param("id") _id: string): Promise<object> {
		return Promise.resolve({ foo: "bar" });
	}

	@Get(":id/messages")
	getMessage(@Param("id") _id: string): Promise<object> {
		return Promise.resolve({ foo: "bar" });
	}

	@Post(":id/messages")
	sendMessage(@Param("id") _id: string): Promise<object> {
		return Promise.resolve({ foo: "bar" });
	}

	@Get(":id/invitations")
	getInvitation(@Param("id") _id: string): Promise<object> {
		return Promise.resolve({ foo: "bar" });
	}

	@Post(":id/invitations")
	sendInvitations(@Param("id") _id: string): Promise<object> {
		return Promise.resolve({ foo: "bar" });
	}
}
