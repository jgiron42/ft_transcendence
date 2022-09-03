import { Injectable } from "@nestjs/common";
import { User } from "@entities/user.entity";
import { Channel } from "@entities/channel.entity";
import { ChanConnection } from "@entities/chan_connection.entity";
import { Socket } from "@src/types/socket";
import { Server } from "socket.io";
import { WsException } from "@nestjs/websockets";
import { ChannelService } from "@services/channel.service";
import { ChanConnectionService } from "@services/chan_connection.service";

@Injectable()
export class ChatService {
	constructor(private channelService: ChannelService, private chanConnectionService: ChanConnectionService) {
		this.clientMap = new Map<Socket, User>(); // map a socket to a user
		this.channelMap = new Map<string, Channel>(); // map a socketId to a channel
	}

	server: Server;
	private clientMap: Map<Socket, User>;
	private channelMap: Map<string, Channel>;

	getClient(client: Socket): User {
		return this.clientMap.get(client);
	}

	connectClient(client: Socket, user: User) {
		this.clientMap.set(client, user);
	}

	async disconnectClient(client: Socket) {
		// remove client from the client pool
		this.clientMap.delete(client);

		// remove client from his channel
		const channel = this.channelMap.get(client.id);
		if (channel) {
			// leaves the `channel:$id` and `realm` rooms
			await client.leave(`channel:${channel.id}`);
			await client.leave("realm");

			// delete the client from the channel map
			this.channelMap.delete(client.id);
		}
	}

	// remove a channel connection, and notify the client if notify is true
	async removeChanConnection(connection: ChanConnection, notify = true): Promise<void> {
		// iterate through client Map
		for (const [_client, _user] of this.clientMap) {
			// if the user.id retrieve from map correspond to the uid parameter
			if (_user.id === connection.user.id) {
				// leaves the `channel:$id` room
				await _client.leave(`channel:${connection.channel.id}`);

				if (notify)
					// Tell the client the connection has been removed
					_client.emit("chat:removeConnection", connection);
			}
		}
	}

	// send a message to all clients in a room
	sendMessage(msg: string, content: any = null, room?: string) {
		// if room is defined, then send the message to all clients in the room
		if (room) this.server.to(room).emit(msg, content);
		// else send the message to all clients
		else this.server.emit(msg, content);
	}

	// send message to all clients of a specific user
	sendMessageToClient(msg: string, content: any = null, user: User | string) {
		// iterate through client map
		for (const [_socket, _user] of this.clientMap) {
			// if the user.id retrieve from map correspond to the user parameter
			if (_user.id === (typeof user === "string" ? user : user.id)) {
				// send the message given in parameter to the client
				_socket.emit(msg, content);
			}
		}
	}

	// send an error to the client
	sendError(error: string) {
		throw new WsException({
			error: "Unauthorized",
			reason: error,
		});
	}

	// join a channel
	async joinChannel(client: Socket, chan_id: number): Promise<void> {
		// get the channel from the database
		const channel = await this.channelService.findOne(chan_id);

		// if channel doesn't exist, send error
		if (!channel) this.sendError("Channel not found.");
		// else if the user can't join the channel, send error
		else if (!(await this.chanConnectionService.isOnChannel(client.session.sessionUser.id, channel.id)))
			this.sendError("User not in channel.");
		// else (if the user can join the channel)
		else {
			// leave the current room
			await this.leaveChannel(client);

			// set the new channel in the channel map for the client
			this.channelMap.set(client.id, channel);

			// join the room of the new channel
			await client.join(`channel:${channel.id}`);

			// tell the client that he successfully joined the channel
			client.emit("chat:JoinChannel", chan_id);
		}
	}

	// leave a channel
	async leaveChannel(client: Socket): Promise<void> {
		const channel = this.channelMap.get(client.id);

		// if the client is in a channel, leave the corresponding room
		if (channel) await client.leave(`channel:${channel.id}`);
	}
}
