import { Injectable } from "@nestjs/common";
import { User } from "@entities/user.entity";
import { Socket, Server } from "socket.io";
import { Message } from "@entities/message.entity";
import { MessageService } from "@services/message.service";

@Injectable()
export class SocketService {
	constructor(private readonly messageService: MessageService) {
		this.clientMap = new Map<string, User>();
	}

	server: Server;
	private clientMap: Map<string, User>;

	getClientSize(): number {
		return this.clientMap.size;
	}

	getClient(socket: Socket): User {
		return this.clientMap.get(socket.id);
	}

	getClientBySocketId(socketId: string): User {
		return this.clientMap.get(socketId);
	}

	getAccountInformation(socket: Socket): User {
		const u = this.getClient(socket);
		if (u) socket.emit("GAI", u);
		return u;
	}

	addClient(socket: Socket, user: User) {
		if (!this.clientMap.has(socket.id)) {
			this.clientMap.set(socket.id, user);
		}
	}

	removeClient(socket: Socket) {
		this.clientMap.delete(socket.id);
	}

	async initChat(client: Socket) {
		const messages = await this.messageService.findAll();
		client.emit("msgToClient", messages);
	}

	sendMessage(message: Message, room: string = undefined) {
		if (room) {
			this.server.to(room).emit("MSG", message);
		}
	}

	sendError(client: Socket, error: Error) {
		client.emit("ERR", error.message);
	}
}
