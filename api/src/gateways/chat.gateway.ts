import {
	SubscribeMessage,
	WebSocketGateway,
	OnGatewayInit,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({
	cors: {
		origin: '*',
	},
})
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer() server: Server;
	private logger: Logger = new Logger('AppGateway');

	@SubscribeMessage('msgToServer')
	handleMessage(client: Socket, payload: string): void {
		void client;
		void payload;
		this.server.emit('msgToClient', payload);
	}

	afterInit(server: Server) {
		void server;
		this.logger.log('Gateway initialized');
	}

	handleDisconnect(client: Socket) {
		this.logger.log(`Client disconnected: ${client.id}`);
	}

	handleConnection(client: Socket) {
		this.logger.log(`Client connected: ${client.id}`);
	}
}
