import { Injectable } from "@nestjs/common";
import { EventSubscriber, EntitySubscriberInterface, InsertEvent, RemoveEvent, UpdateEvent, Connection } from "typeorm";
import { ChanConnection, ChannelRole } from "@entities/chan_connection.entity";
import { ChatService } from "@services/chat.service";
import { User } from "@entities/user.entity";
import { Channel, ChannelType } from "@entities/channel.entity";

@EventSubscriber()
@Injectable()
export class ChanConnectionSubscriber implements EntitySubscriberInterface<ChanConnection> {
	constructor(private readonly connection: Connection, private chatService: ChatService) {
		this.connection.subscribers.push(this);
	}

	listenTo() {
		return ChanConnection;
	}

	afterInsert(event: InsertEvent<ChanConnection>) {
		this.chatService.sendMessage("chat:newConnection", event.entity, `channel:${event.entity.channel.id}`);
		this.chatService.sendMessageToClient("chat:newConnection", event.entity, event.entity.user.id);
		if (event.entity.channel.type === ChannelType.DM) {
			this.chatService.sendMessageToClient("chat:newDm", event.entity, event.entity.user);
		}
	}

	async beforeRemove(event: RemoveEvent<ChanConnection>) {
		this.chatService.sendMessage("chat:removeConnection", event.entity, `channel:${event.entity.channel.id}`);
		await this.chatService.removeChanConnection(event.entity);
	}

	async afterUpdate(event: UpdateEvent<ChanConnection>) {
		this.chatService.sendMessage(
			"chat:updateConnection",
			event.entity,
			`channel:${(event.entity.channel as Channel).id}`,
		);
		this.chatService.sendMessageToClient("chat:updateConnection", event.entity, (event.entity.user as User).id);
		if (event.entity.role === ChannelRole.BANNED)
			await this.chatService.removeChanConnection(event.entity as ChanConnection);
	}
}
