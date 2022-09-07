import { Logger, UseGuards, UseInterceptors, ParseIntPipe } from "@nestjs/common";
import {
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	OnGatewayInit,
	OnGatewayDisconnect,
	ConnectedSocket,
	MessageBody,
	WsException,
} from "@nestjs/websockets";
import { UserService } from "@services/user.service";
import { Server } from "socket.io";
import { Socket } from "@src/types/socket";
import { SessionGuard } from "@guards/session.guard";
import { WebsocketSaveSession } from "@interceptors/websocket-save-session";
import { ChatService } from "@services/chat.service";

@WebSocketGateway({
	namespace: "chat",
	cors: {
		origin: "*",
	},
})
@UseInterceptors(WebsocketSaveSession)
@UseGuards(...SessionGuard)
export class ChatGateway implements OnGatewayInit, OnGatewayDisconnect {
	constructor(private readonly userService: UserService, private chatService: ChatService) {}

	@WebSocketServer() server: Server;
	private logger: Logger = new Logger("ChatGateway");

	afterInit(server: Server) {
		this.chatService.server = server;
		this.logger.log("Chat gateway initialized.");
	}

	// Log the connection
	handleConnection(client: Socket) {
		this.logger.log(`Client connected on chat: ${client.id}`);
	}

	// Remove client from the pool it's in
	async handleDisconnect(client: Socket) {
		// debug log
		this.logger.log(`Client disconnected from chat: ${client.id}`);

		// remove client from pool
		await this.chatService.disconnectClient(client);
	}

	// Initialize client session for chat, or throws 401 when unauthenticated
	@SubscribeMessage("authenticate")
	async authenticate(@ConnectedSocket() client: Socket) {
		// Get user from DB
		client.session.user = await this.userService.getQuery().is(client.session.sessionUser.id).getOneOrFail();

		// Add user to pool
		this.chatService.connectClient(client, client.session.user);

		// Join default room (all users connected are at least in this room)
		// It ensure that only connected users can receive messages.
		await client.join("realm");

		// Tell the client they're authenticated
		client.emit("authenticate", { status: "success", user: client.session.user });
	}

	@SubscribeMessage("chat:JoinChannel")
	async onJoinChannel(
		@ConnectedSocket() client: Socket,
		@MessageBody(
			new ParseIntPipe({
				exceptionFactory: (errors: string) => {
					throw new WsException(errors);
				},
			}),
		)
		chan_id: number,
	): Promise<void> {
		// get user from pool
		const user = this.chatService.getClient(client);

		// if user exist, then join channel
		if (user) await this.chatService.joinChannel(client, chan_id);
		// else send Error telling the user isn't found
		else this.chatService.sendError("User not found.");
	}
}
