import { Logger } from "@nestjs/common";
import {
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	OnGatewayInit,
	OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Message } from "@entities/message.entity";
import { UserService } from "@services/user.service";
import { MessageService } from "@services/message.service";
import { SocketService } from "@services/socket.service";
import { Socket, Server } from "socket.io";

@WebSocketGateway({
	namespace: "chat",
	cors: {
		origin: "*",
	},
})
export class ChatGateway implements OnGatewayInit, OnGatewayDisconnect {
	constructor(
		private readonly userService: UserService,
		private readonly messageService: MessageService,
		private readonly socketService: SocketService,
	) {}

	@WebSocketServer() server: Server;
	private logger: Logger = new Logger("ChatGateway");

	afterInit(server: Server) {
		this.socketService.server = server;
		this.logger.log("Gateway initialized.");
	}

	@SubscribeMessage("msgToServer")
	async handleMessage(client: Socket, payload: { name: string; text: string; mine: boolean }): Promise<void> {
		const u = this.socketService.getClient(client);
		if (u) {
			const message = new Message();
			message.send_by = u.pseudo;
			message.content = payload.text;
			message.date = new Date();
			await this.messageService.create(message);
			this.socketService.sendMessage(message, "realm");
		} else {
			this.logger.error("User not found");
		}
	}

	@SubscribeMessage("whoAmI")
	onWhoAmI(client: Socket) {
		this.socketService.whoAmI(client);
	}

	@SubscribeMessage("joinRealm")
	async joinRealm(client: Socket, payload: { uid: string }) {
		const usr = await this.userService.findByUid(payload.uid);
		if (usr) {
			client.emit("joinRealm", true);
			await client.join("realm");
			this.socketService.addClient(client, usr);
			this.socketService.whoAmI(client);
			await this.socketService.initChat(client);
			this.logger.log(`sockets[] size: ${this.socketService.getClientSize()}`);
		}
	}

	handleDisconnect(client: Socket) {
		this.logger.log(`Client disconnected: ${client.id}`);
		this.socketService.removeClient(client);
	}
}
