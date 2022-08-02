import { User } from "@/models/User";

export enum RelationType {
	FRIEND,
	FRIEND_REQUEST,
	BLOCK,
}

export class Relation {
	constructor() {
		this.created_at = new Date();
	}

	id: number;
	owner: User;
	target: User;
	type: RelationType;
	created_at: Date;
}
