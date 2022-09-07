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

	async afterInsert(event: InsertEvent<Relation>) {
		// https://stackoverflow.com/questions/62887344/queries-in-afterupdate-are-not-working-as-expected-in-typeorm?rq=1
		// Wait for relation to me fully saved and fetchable
		await event.queryRunner.commitTransaction();
		await event.queryRunner.startTransaction();
		this.chatService.sendMessageToClient("chat:addRelation", event.entity, event.entity.owner);
		if (event.entity.type !== RelationType.BLOCK)
			this.chatService.sendMessageToClient("chat:addRelation", event.entity, event.entity.target);
	}

	async afterUpdate(event: UpdateEvent<Relation>) {
		// https://stackoverflow.com/questions/62887344/queries-in-afterupdate-are-not-working-as-expected-in-typeorm?rq=1
		// Wait for relation to me fully updated
		await event.queryRunner.commitTransaction();
		await event.queryRunner.startTransaction();
		const relation = event.entity as Relation;
		this.chatService.sendMessageToClient("chat:updateRelation", event.entity, relation.owner);
		if (event.entity.type !== RelationType.BLOCK)
			this.chatService.sendMessageToClient("chat:updateRelation", event.entity, relation.target);
	}

	async beforeRemove(event: RemoveEvent<Relation>) {
		// https://stackoverflow.com/questions/62887344/queries-in-afterupdate-are-not-working-as-expected-in-typeorm?rq=1
		// Wait for message to me fully removed
		await event.queryRunner.commitTransaction();
		await event.queryRunner.startTransaction();
		const relation = event.entity;
		this.chatService.sendMessageToClient("chat:removeRelation", relation, relation.owner);
		if (event.entity.type !== RelationType.BLOCK)
			this.chatService.sendMessageToClient("chat:removeRelation", relation, relation.target);
	}
}
