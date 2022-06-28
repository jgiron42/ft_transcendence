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

@WebSocketGateway({
	namespace: "chat",
	cors: {
		origin: "*",
	},
})
@UseInterceptors(WebsocketSaveSession)
@UseGuards(...SessionGuard)
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	constructor(private readonly userService: UserService) {}

	@WebSocketServer() server: Server;
	private logger: Logger = new Logger("ChatGateway");

	afterInit(server: Server) {
		void server;
		this.logger.log("Gateway initialized.");
	}

	@SubscribeMessage("HC")
	async onHelloConnection(@ConnectedSocket() socket: Socket) {
		if (socket.session === undefined) return;
		const usr = await this.userService.findOne(socket.session.user.id);
		try {
			if (usr) {
				// await this.channelService.joinChannel(socket, "realm");
				socket.emit("updateChannels");
			} else {
				throw new Error("User not found");
			}
		} catch (e) {
			this.logger.error(e);
		}
	}

	handleConnection(socket: Socket) {
		socket.emit("HC");
	}

	handleDisconnect(client: Socket) {
		this.logger.log(`Client disconnected: ${client.id}`);
	}
}
