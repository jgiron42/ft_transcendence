import { Logger } from "@nestjs/common";
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Message } from "@entities/message.entity";
import { MessageService } from "@services/message.service";
import { SocketService } from "@services/socket.service";
import { Socket, Server } from "socket.io";

@WebSocketGateway({
	namespace: "appSocket",
	cors: {
		origin: "*",
	},
})
export class ChatGateway {
	constructor(private readonly messageService: MessageService, private readonly socketService: SocketService) {}

	// Morbius
	@WebSocketServer() server: Server;
	private logger: Logger = new Logger("ChatGateway");

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
}
