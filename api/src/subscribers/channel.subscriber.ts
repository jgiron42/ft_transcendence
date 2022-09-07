import { Injectable } from "@nestjs/common";
import { EventSubscriber, EntitySubscriberInterface, InsertEvent, UpdateEvent, RemoveEvent, Connection } from "typeorm";
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

	async afterInsert(event: InsertEvent<Channel>) {
		// https://stackoverflow.com/questions/62887344/queries-in-afterupdate-are-not-working-as-expected-in-typeorm?rq=1
		// Wait for message to me fully saved and fetchable
		await event.queryRunner.commitTransaction();
		await event.queryRunner.startTransaction();
		if (event.entity.type !== ChannelType.DM) {
			this.chatService.sendMessage("chat:newChannel", event.entity, "realm");
		}
	}

	async afterUpdate(event: UpdateEvent<Channel>) {
		// https://stackoverflow.com/questions/62887344/queries-in-afterupdate-are-not-working-as-expected-in-typeorm?rq=1
		// Wait for message to me fully saved and fetchable
		await event.queryRunner.commitTransaction();
		await event.queryRunner.startTransaction();
		this.chatService.sendMessage("chat:updateChannel", event.entity, "realm");
	}

	async beforeRemove(event: RemoveEvent<Channel>) {
		// https://stackoverflow.com/questions/62887344/queries-in-afterupdate-are-not-working-as-expected-in-typeorm?rq=1
		// Wait for message to me fully saved and fetchable
		await event.queryRunner.commitTransaction();
		await event.queryRunner.startTransaction();
		this.chatService.sendMessage("chat:removeChannel", event.entity, "realm");
	}
}
