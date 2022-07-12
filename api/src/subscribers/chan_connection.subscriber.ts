import { Injectable } from "@nestjs/common";
import { EventSubscriber, EntitySubscriberInterface, InsertEvent, Connection } from "typeorm";
import { ChanConnection } from "@entities/chan_connection.entity";
import { SocketService } from "@services/socket.service";

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
		this.socketService.sendMessage("updateChanConnections", null, event.entity.channel.name);
	}
}
