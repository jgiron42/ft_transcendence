import { Injectable } from "@nestjs/common";
import { EventSubscriber, EntitySubscriberInterface, UpdateEvent, InsertEvent, RemoveEvent, Connection } from "typeorm";
import { Relation, RelationType } from "@entities/relation.entity";
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
		this.socketService.sendMessageToClient("addRelation", event.entity, event.entity.owner);
		if (event.entity.type !== RelationType.BLOCK)
			this.socketService.sendMessageToClient("addRelation", event.entity, event.entity.target);
	}

	afterUpdate(event: UpdateEvent<Relation>) {
		const relation = event.entity as Relation;
		this.socketService.sendMessageToClient("updateRelation", event.entity, relation.owner);
		if (event.entity.type !== RelationType.BLOCK)
			this.socketService.sendMessageToClient("updateRelation", event.entity, relation.target);
	}

	beforeRemove(event: RemoveEvent<Relation>) {
		const relation = event.entity;
		this.socketService.sendMessageToClient("removeRelation", relation, relation.owner);
		if (event.entity.type !== RelationType.BLOCK)
			this.socketService.sendMessageToClient("removeRelation", relation, relation.target);
	}
}