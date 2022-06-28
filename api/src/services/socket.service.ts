import { Injectable } from "@nestjs/common";
import { User } from "@entities/user.entity";
import { Socket } from "@src/types/socket";
import { Server } from "socket.io";
import { WsException } from "@nestjs/websockets";

@Injectable()
export class SocketService {
	constructor() {
		this.clientMap = new Map<string, User>();
	}

	static server: Server;
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

	addClient(socket: Socket, user: User) {
		if (!this.clientMap.has(socket.id)) {
			this.clientMap.set(socket.id, user);
		}
	}

	removeClient(socket: Socket) {
		this.clientMap.delete(socket.id);
	}

	sendMessage(msg: string, content: any = null, room = "") {
		if (room !== "") SocketService.server.to(room).emit(msg, content);
		else SocketService.server.emit(msg, content);
	}

	sendError(error: string) {
		throw new WsException({
			error: "Unauthorized",
			reason: error,
			authMethod: "42",
		});
	}
}
