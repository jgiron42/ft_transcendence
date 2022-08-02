import { Injectable } from "@nestjs/common";
import { EventSubscriber, EntitySubscriberInterface, UpdateEvent, InsertEvent, RemoveEvent, Connection } from "typeorm";
import { Relation, RelationType } from "@entities/relation.entity";
import { ChatService } from "@services/chat.service";

@EventSubscriber()
@Injectable()
export class RelationSubscriber implements EntitySubscriberInterface<Relation> {
	constructor(private readonly connection: Connection, private chatService: ChatService) {
		this.connection.subscribers.push(this);
	}

	listenTo() {
		return Relation;
	}

	afterInsert(event: InsertEvent<Relation>) {
		this.chatService.sendMessageToClient("chat:addRelation", event.entity, event.entity.owner);
		if (event.entity.type !== RelationType.BLOCK)
			this.chatService.sendMessageToClient("chat:addRelation", event.entity, event.entity.target);
	}

	afterUpdate(event: UpdateEvent<Relation>) {
		const relation = event.entity as Relation;
		this.chatService.sendMessageToClient("chat:updateRelation", event.entity, relation.owner);
		if (event.entity.type !== RelationType.BLOCK)
			this.chatService.sendMessageToClient("chat:updateRelation", event.entity, relation.target);
	}

	beforeRemove(event: RemoveEvent<Relation>) {
		const relation = event.entity;
		this.chatService.sendMessageToClient("chat:removeRelation", relation, relation.owner);
		if (event.entity.type !== RelationType.BLOCK)
			this.chatService.sendMessageToClient("chat:removeRelation", relation, relation.target);
	}
}
