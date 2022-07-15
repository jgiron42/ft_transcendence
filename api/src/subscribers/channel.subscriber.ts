import { Injectable } from "@nestjs/common";
import { EventSubscriber, EntitySubscriberInterface, InsertEvent, UpdateEvent, Connection } from "typeorm";
import { Channel, ChannelType } from "@entities/channel.entity";
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
		if (event.entity.type !== ChannelType.DM) {
			this.socketService.sendMessage("updateChannel", event.entity, "realm");
		}
	}

	afterUpdate(event: UpdateEvent<Channel>) {
		this.socketService.sendMessage("updateChannel", event.entity, "realm");
	}
}
