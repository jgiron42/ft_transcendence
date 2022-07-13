import { Injectable } from "@nestjs/common";
import { User } from "@entities/user.entity";
import { Socket } from "@src/types/socket";
import { Server } from "socket.io";
import { WsException } from "@nestjs/websockets";

@Injectable()
export class SocketService {
	constructor() {
		this.clientMap = new Map<Socket, User>();
	}

	server: Server;
	private clientMap: Map<Socket, User>;

	getClientSize(): number {
		return this.clientMap.size;
	}

	getClient(socket: Socket): User {
		return this.clientMap.get(socket);
	}

	addClient(socket: Socket, user: User) {
		if (!this.clientMap.has(socket)) {
			this.clientMap.set(socket, user);
		}
	}

	removeClient(socket: Socket) {
		this.clientMap.delete(socket);
	}

	sendMessage(msg: string, content: any = null, room?: string) {
		if (room) this.server.to(room).emit(msg, content);
		else this.server.emit(msg, content);
	}

	sendMessageToClient(msg: string, content: any = null, user: User | string) {
		for (const [_socket, _user] of this.clientMap) {
			if (_user.id === (typeof user === "string" ? user : user.id)) {
				_socket.emit(msg, content);
			}
		}
	}

	sendError(error: string) {
		throw new WsException({
			error: "Unauthorized",
			reason: error,
			authMethod: "42",
		});
	}
}
