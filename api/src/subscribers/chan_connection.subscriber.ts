import { Injectable } from "@nestjs/common";
import { EventSubscriber, EntitySubscriberInterface, InsertEvent, RemoveEvent, UpdateEvent, Connection } from "typeorm";
import { ChanConnection } from "@entities/chan_connection.entity";
import { SocketService } from "@services/socket.service";
import { User } from "@entities/user.entity";

@EventSubscriber()
@Injectable()
export class ChanConnectionSubscriber implements EntitySubscriberInterface<ChanConnection> {
	constructor(private readonly connection: Connection, private socketService: SocketService) {
		this.connection.subscribers.push(this);
		void this.socketService;
	}

	listenTo() {
		return ChanConnection;
	}

	afterInsert(event: InsertEvent<ChanConnection>) {
		this.socketService.sendMessage("newConnection", event.entity, event.entity.channel.name);
	}

	async beforeRemove(event: RemoveEvent<ChanConnection>) {
		this.socketService.sendMessage("removeConnection", event.entity, event.entity.channel.name);
		await this.socketService.leaveRoom(event.entity.user.id, event.entity.channel.name);
	}

	afterUpdate(event: UpdateEvent<ChanConnection>) {
		this.socketService.sendMessageToClient("updateConnection", event.entity, event.entity.user as User);
	}
}
