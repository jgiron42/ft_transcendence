import { User } from "@/models/User";

export enum RelationType {
	FRIEND,
	FRIEND_REQUEST,
	BLOCK,
	GAME,
}

export interface RelationUserInterface {
	id: string;
	username: string;
}

// Allows to create faky relations for invitations list.
export interface RelationInterface {
	id: number | string;
	owner: RelationUserInterface;
	target: RelationUserInterface;
	type: RelationType;
	created_at: Date;
}

export class Relation implements RelationInterface {
	constructor() {
		this.created_at = new Date();
	}

	id: number;
	owner: User;
	target: User;
	type: RelationType;
	created_at: Date;
}

export interface GameInviteRelation extends RelationInterface {
	mode: string;
}
