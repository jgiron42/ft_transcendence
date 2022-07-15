import { Injectable } from "@nestjs/common";
import { EventSubscriber, EntitySubscriberInterface, UpdateEvent, InsertEvent, RemoveEvent, Connection } from "typeorm";
import { Relation } from "@entities/relation.entity";
import { SocketService } from "@services/socket.service";

@EventSubscriber()
@Injectable()
export class RelationSubscriber implements EntitySubscriberInterface<Relation> {
	constructor(private readonly connection: Connection, private socketService: SocketService) {
		this.connection.subscribers.push(this);
	}

	listenTo() {
		return Relation;
	}

	afterInsert(event: InsertEvent<Relation>) {
		this.socketService.sendMessageToClient("updateRelations", null, event.entity.target);
	}

	afterUpdate(event: UpdateEvent<Relation>) {
		const relation = event.entity as Relation;
		this.socketService.sendMessageToClient("updateRelations", null, relation.owner);
		this.socketService.sendMessageToClient("updateRelations", null, relation.target);
	}

	beforeRemove(event: RemoveEvent<Relation>) {
		const relation = event.entity;
		this.socketService.sendMessageToClient("removeRelation", relation.id, relation.owner);
		this.socketService.sendMessageToClient("removeRelation", relation.id, relation.target);
	}
}
