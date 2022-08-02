import { Injectable } from "@nestjs/common";
import { EventSubscriber, EntitySubscriberInterface, InsertEvent, RemoveEvent, Connection } from "typeorm";
import { ChanInvitation } from "@entities/chan_invitation.entity";
import { ChatService } from "@services/chat.service";
import { User } from "@entities/user.entity";

@EventSubscriber()
@Injectable()
export class ChanInvitationSubscriber implements EntitySubscriberInterface<ChanInvitation> {
	constructor(private readonly connection: Connection, private chatService: ChatService) {
		this.connection.subscribers.push(this);
	}

	listenTo() {
		return ChanInvitation;
	}

	afterInsert(event: InsertEvent<ChanInvitation>) {
		this.chatService.sendMessageToClient("chat:newInvitation", event.entity.id, (event.entity.user as User).id);
	}

	beforeRemove(event: RemoveEvent<ChanInvitation>) {
		this.chatService.sendMessageToClient("chat:removeInvitation", event.entity, (event.entity.user as User).id);
	}
}
