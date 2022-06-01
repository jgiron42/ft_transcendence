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

	whoAmI(socket: Socket): User {
		const u = this.getClient(socket);
		socket.emit("whoAmI", u);
		return u;
	}

	addClient(socket: Socket, user: User) {
		this.clientMap.set(socket.id, user);
	}

	removeClient(socket: Socket) {
		this.clientMap.delete(socket.id);
	}

	async initChat(client: Socket) {
		const messages = await this.messageService.findAll();
		for (const message of messages) {
			client.emit("msgToClient", message);
		}
	}

	sendMessage(message: Message, room: string = undefined) {
		if (room) {
			this.server.to(room).emit("msgToClient", message);
		}
	}
}
