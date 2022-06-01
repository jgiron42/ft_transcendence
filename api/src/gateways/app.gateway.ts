import {
	SubscribeMessage,
	WebSocketGateway,
	OnGatewayInit,
	WebSocketServer,
	OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Logger } from "@nestjs/common";
import { Socket, Server } from "socket.io";
import { ChatService } from "@services/chat.service";
import { UserService } from "@services/user.service";
import { SocketService } from "@services/socket.service";

@WebSocketGateway({
	namespace: ["appSocket"],
	cors: {
		origin: "*",
	},
})
export class AppGateway implements OnGatewayInit, OnGatewayDisconnect {
	constructor(
		private readonly chatService: ChatService,
		private readonly userService: UserService,
		private readonly socketService: SocketService,
	) {
		void this.socketService;
	}

	@WebSocketServer() server: Server;
	private logger: Logger = new Logger("AppGateway");

	afterInit(server: Server) {
		void server;
		this.logger.log("Gateway initialized.");
	}

	@SubscribeMessage("joinRealm")
	async joinRealm(client: Socket, payload: { uid: string }) {
		const usr = await this.userService.findByUid(payload.uid);
		if (usr && !this.socketService.getUserBySocketId(client.id)) {
			this.socketService.addClient(usr, client);
			await this.socketService.initChat(client, usr);
			this.logger.log(`sockets[] size: ${this.socketService.getClientSize()}`);
		}
	}

	async handleDisconnect(client: Socket) {
		this.logger.log(`Client disconnected: ${client.id}`);
		await this.chatService.deleteUser(client.id);
	}
}
