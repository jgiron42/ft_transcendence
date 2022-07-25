import { Injectable } from "@nestjs/common";
import { EventSubscriber, EntitySubscriberInterface, InsertEvent, Connection } from "typeorm";
import { ChanInvitation } from "@entities/chan_invitation.entity";
import { SocketService } from "@services/socket.service";
import { User } from "@entities/user.entity";

@EventSubscriber()
@Injectable()
export class ChanInvitationSubscriber implements EntitySubscriberInterface<ChanInvitation> {
	constructor(private readonly connection: Connection, private socketService: SocketService) {
		this.connection.subscribers.push(this);
	}

	listenTo() {
		return ChanInvitation;
	}

	afterInsert(event: InsertEvent<ChanInvitation>) {
		this.socketService.sendMessageToClient("newInvitation", event.entity.id, (event.entity.user as User).id);
	}
}
