import {
	SubscribeMessage,
	WebSocketGateway,
	OnGatewayInit,
	WebSocketServer,
	OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Logger } from "@nestjs/common";
import { Socket, Server } from "socket.io";
import { UserService } from "@services/user.service";
import { SocketService } from "@services/socket.service";

@WebSocketGateway({
	namespace: ["appSocket"],
	cors: {
		origin: "*",
	},
})
export class AppGateway implements OnGatewayInit, OnGatewayDisconnect {
	constructor(private readonly userService: UserService, private readonly socketService: SocketService) {}

	@WebSocketServer() server: Server;
	private logger: Logger = new Logger("AppGateway");

	afterInit(server: Server) {
		this.socketService.server = server;
		this.logger.log("Gateway initialized.");
	}

	@SubscribeMessage("joinRealm")
	async joinRealm(client: Socket, payload: { uid: string }) {
		const usr = await this.userService.findByUid(payload.uid);
		if (usr && !this.socketService.getClientBySocketId(client.id)) {
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
