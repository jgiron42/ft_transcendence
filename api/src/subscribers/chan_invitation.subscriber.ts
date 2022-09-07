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

	async afterInsert(event: InsertEvent<ChanInvitation>) {
		// https://stackoverflow.com/questions/62887344/queries-in-afterupdate-are-not-working-as-expected-in-typeorm?rq=1
		// Wait for invitation to me fully saved and fetchable
		await event.queryRunner.commitTransaction();
		await event.queryRunner.startTransaction();
		this.chatService.sendMessageToClient("chat:newInvitation", event.entity.id, (event.entity.user as User).id);
	}

	async beforeRemove(event: RemoveEvent<ChanInvitation>) {
		// https://stackoverflow.com/questions/62887344/queries-in-afterupdate-are-not-working-as-expected-in-typeorm?rq=1
		// Wait for invitation to me fully removed.
		await event.queryRunner.commitTransaction();
		await event.queryRunner.startTransaction();
		this.chatService.sendMessageToClient("chat:removeInvitation", event.entity, (event.entity.user as User).id);
	}
}
