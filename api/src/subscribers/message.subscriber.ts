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

	afterInsert(event: InsertEvent<Message>) {
		this.chatService.sendMessage(
			"chat:newMessage",
			{ id: event.entity.id, user: (event.entity.user as User).id },
			`channel:${(event.entity.channel as Channel).id}`,
		);
	}
}
