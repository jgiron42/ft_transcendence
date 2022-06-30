import { Logger, UseGuards, UseInterceptors } from "@nestjs/common";
import {
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	OnGatewayInit,
	OnGatewayConnection,
	OnGatewayDisconnect,
	ConnectedSocket,
} from "@nestjs/websockets";
import { UserService } from "@services/user.service";
import { Server } from "socket.io";
import { Socket } from "@src/types/socket";
import { SessionGuard } from "@guards/session.guard";
import { WebsocketSaveSession } from "@interceptors/websocket-save-session";
import { SocketService } from "@services/socket.service";
import { ChannelService } from "@services/channel.service";
import { ChanConnectionService } from "@services/chan_connection.service";
import { Channel } from "@entities/channel.entity";
import { MessageService } from "@services/message.service";
import { Message } from "@entities/message.entity";

@WebSocketGateway({
	namespace: "chat",
	cors: {
		origin: "*",
	},
})
@UseInterceptors(WebsocketSaveSession)
@UseGuards(...SessionGuard)
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	constructor(
		private readonly userService: UserService,
		private messageService: MessageService,
		private socketService: SocketService,
		private channelService: ChannelService,
		private chanConnectionService: ChanConnectionService,
	) {
		this.channelMap = new Map<string, Channel>();
	}

	@WebSocketServer() server: Server;
	private logger: Logger = new Logger("ChatGateway");
	private channelMap: Map<string, Channel>;

	afterInit(server: Server) {
		SocketService.server = server;
		this.logger.log("Chat gateway initialized.");
	}

	handleConnection(socket: Socket) {
		socket.emit("HC");
	}

	async handleDisconnect(socket: Socket) {
		this.socketService.removeClient(socket);
		if (this.channelMap.has(socket.id)) {
			const chan = this.channelMap.get(socket.id);
			await socket.leave(chan.name);
			this.channelMap.delete(socket.id);
		}
		this.logger.log(`Client disconnected: ${socket.id}`);
	}

	@SubscribeMessage("HC")
	async onHelloConnection(@ConnectedSocket() socket: Socket) {
		if (socket.session === undefined) return;
		const usr = await this.userService.findOne(socket.session.user.id);
		if (usr) {
			this.socketService.addClient(socket, usr);
			await socket.join("realm");
			socket.emit("updateChannels");
		} else {
			this.socketService.sendError("User not found.");
		}
	}

	@SubscribeMessage("JC")
	async onJoinChannel(client: Socket, chan_id: number): Promise<void> {
		const usr = this.socketService.getClient(client);
		if (usr) {
			await this.joinChannel(client, chan_id);
		} else {
			this.socketService.sendError("User not found.");
		}
	}

	async joinChannel(client: Socket, chan_id: number): Promise<void> {
		const chan = await this.channelService.findOne(chan_id);
		if (chan === undefined) this.socketService.sendError("Channel not found.");
		else if (!(await this.chanConnectionService.isOnChannel(client.session.user.id, chan.id)))
			this.socketService.sendError("User not in channel.");
		else {
			await this.leaveChannel(client);
			this.channelMap.set(client.id, chan);
			await client.join(chan.name);
			const messages = await this.messageService
				.getQuery()
				.see_message(client.session.user.id)
				.channel(chan.id)
				.getMany();
			messages.sort((a: Message, b: Message): number => a.created_at.getTime() - b.created_at.getTime());
			client.emit("JC", messages);
			client.emit("updateUsers");
		}
	}

	async leaveChannel(client: Socket): Promise<void> {
		if (this.channelMap.has(client.id)) {
			const chan = this.channelMap.get(client.id);
			await client.leave(chan.name);
		}
	}

	// async getChannelBySocketId(socketId: string): Promise<Channel> {
	// 	if (!this.channelMap.has(socketId)) {
	// 		throw new Error("Socket not in channel");
	// 	}
	// 	const chanName = this.channelMap.get(socketId);
	// 	const chan = await this.findByName(chanName);
	// 	if (!chan) {
	// 		throw new Error("Channel not found");
	// 	}
	// 	return chan;
	// }
}
