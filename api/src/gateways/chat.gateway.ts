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
import { ChannelService } from "@services/channel.service";
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
		private readonly channelService: ChannelService,
	) {}

	@WebSocketServer() server: Server;
	private logger: Logger = new Logger("ChatGateway");

	afterInit(server: Server) {
		this.socketService.server = server;
		this.logger.log("Gateway initialized.");
	}

	@SubscribeMessage("HC")
	async onHelloConnection(client: Socket, payload: { name: string }) {
		const usr = await this.userService.findByUid(payload.name);
		try {
			if (usr) {
				this.socketService.addClient(client, usr);
				this.onGAI(client);
				await this.channelService.joinChannel(client, "realm");
			} else {
				throw new Error("User not found");
			}
		} catch (e) {
			this.logger.error(e);
			this.socketService.sendError(client, e as Error);
		}
	}

	@SubscribeMessage("MSG")
	async onMSG(client: Socket, payload: { content: string }): Promise<void> {
		const u = this.socketService.getClient(client);
		try {
			if (u) {
				const chan = await this.channelService.getChannelBySocketId(client.id);
				if (chan) {
					const message = new Message(payload.content, u.pseudo, chan);
					await this.messageService.create(message);
					this.socketService.sendMessage(message, chan.name);
				} else {
					throw new Error("Channel not found");
				}
			} else {
				throw new Error("User not found");
			}
		} catch (e) {
			this.logger.error(e);
			this.socketService.sendError(client, e as Error);
		}
	}

	@SubscribeMessage("GAI")
	onGAI(client: Socket) {
		this.socketService.getAccountInformation(client);
	}

	// NOT MY PART
	@SubscribeMessage("GC")
	async onGC(client: Socket): Promise<void> {
		const usr = this.socketService.getClient(client);
		try {
			if (usr) {
				client.emit("GC", await this.channelService.findAll());
			}
		} catch (e) {
			this.logger.error(e);
			this.socketService.sendError(client, e as Error);
		}
	}
	@SubscribeMessage("JC")
	async onJC(client: Socket, payload: string): Promise<void> {
		const usr = this.socketService.getClient(client);
		try {
			if (usr) {
				await this.channelService.joinChannel(client, payload);
			} else {
				throw new Error("User not found");
			}
		} catch (e) {
			this.logger.error(e);
			this.socketService.sendError(client, e as Error);
		}
	}

	handleDisconnect(client: Socket) {
		this.logger.log(`Client disconnected: ${client.id}`);
		this.socketService.removeClient(client);
	}
}
