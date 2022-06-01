import { Injectable } from "@nestjs/common";
import { User } from "@entities/user.entity";
import { Socket } from "socket.io";
import { Message } from "@entities/message.entity";
import { MessageService } from "@services/message.service";

@Injectable()
export class SocketService {
	constructor(private readonly messageService: MessageService) {
		this.clientMap = new Map<string, User>();
		this.socketMap = new Map<string, Socket[]>();
		void this.socketMap;
	}

	private clientMap: Map<string, User>;
	private socketMap: Map<string, Socket[]>;

	addClient(user: User, socket: Socket) {
		this.clientMap.set(socket.id, user);
		if (!this.socketMap.has(user.pseudo)) {
			this.socketMap.set(user.pseudo, [socket]);
		} else {
			this.socketMap.get(user.pseudo).push(socket);
		}
	}

	getClientSize(): number {
		return this.clientMap.size;
	}

	getClient(socket: Socket): User {
		return this.clientMap.get(socket.id);
	}

	sendMessageExceptSender(data: Message) {
		data.mine = false;
		for (const [key, value] of this.clientMap) {
			if (value.pseudo !== data.send_by) {
				const s = this.socketMap.get(value.pseudo);
				for (const socket of s) {
					if (socket.id === key) socket.emit("msgToClient", data);
				}
			}
		}
	}

	sendMessageToUser(user: User, data: Message) {
		const s = this.socketMap.get(data.send_by);
		data.mine = user.pseudo === data.send_by;
		s.forEach((socket) => {
			socket.emit("msgToClient", data);
		});
	}

	sendMessage(user: User, data: Message) {
		this.sendMessageToUser(user, data);
		this.sendMessageExceptSender(data);
	}

	async initChat(client: Socket, user: User) {
		const messages = await this.messageService.findAll();
		for (const message of messages) {
			message.mine = user.pseudo === message.send_by;
			client.emit("msgToClient", message);
		}
	}

	getSocketsByUid(user: User): Socket[] {
		return this.socketMap.get(user.pseudo);
	}

	getUserBySocketId(socketId: string): User {
		return this.clientMap.get(socketId);
	}
}
