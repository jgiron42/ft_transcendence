import { Injectable } from "@nestjs/common";
import { EventSubscriber, EntitySubscriberInterface, InsertEvent, Connection } from "typeorm";
import { Message } from "@entities/message.entity";
import { Channel } from "@entities/channel.entity";
import { User } from "@entities/user.entity";
import { ChatService } from "@services/chat.service";

@EventSubscriber()
@Injectable()
export class MessageSubscriber implements EntitySubscriberInterface<Message> {
	constructor(private readonly connection: Connection, private chatService: ChatService) {
		this.connection.subscribers.push(this);
	}

	listenTo() {
		return Message;
	}

	async afterInsert(event: InsertEvent<Message>) {
		// https://stackoverflow.com/questions/62887344/queries-in-afterupdate-are-not-working-as-expected-in-typeorm?rq=1
		// Wait for message to me fully saved and fetchable
		await event.queryRunner.commitTransaction();
		await event.queryRunner.startTransaction();
		this.chatService.sendMessage(
			"chat:newMessage",
			{ id: event.entity.id, user: (event.entity.user as User).id },
			`channel:${(event.entity.channel as Channel).id}`,
		);
	}
}
