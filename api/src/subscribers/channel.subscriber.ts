import { Injectable } from "@nestjs/common";
import { EventSubscriber, EntitySubscriberInterface, InsertEvent, UpdateEvent, Connection } from "typeorm";
import { Channel, ChannelType } from "@entities/channel.entity";
import { ChatService } from "@services/chat.service";

@EventSubscriber()
@Injectable()
export class ChannelSubscriber implements EntitySubscriberInterface<Channel> {
	constructor(private readonly connection: Connection, private chatService: ChatService) {
		this.connection.subscribers.push(this);
	}

	listenTo() {
		return Channel;
	}

	afterInsert(event: InsertEvent<Channel>) {
		if (event.entity.type !== ChannelType.DM) {
			this.chatService.sendMessage("chat:newChannel", event.entity, "realm");
		}
	}

	afterUpdate(event: UpdateEvent<Channel>) {
		this.chatService.sendMessage("chat:updateChannel", event.entity, "realm");
	}
}
