import { Injectable } from "@nestjs/common";
import { EventSubscriber, EntitySubscriberInterface, InsertEvent, Connection } from "typeorm";
import { Channel } from "@entities/channel.entity";
import { SocketService } from "@services/socket.service";

@EventSubscriber()
@Injectable()
export class ChannelSubscriber implements EntitySubscriberInterface<Channel> {
	constructor(private readonly connection: Connection, private socketService: SocketService) {
		this.connection.subscribers.push(this);
		void this.socketService;
	}

	listenTo() {
		return Channel;
	}

	afterInsert(event: InsertEvent<Channel>) {
		void event;
		this.socketService.sendMessage("updateChannels", null, "realm");
	}
}
