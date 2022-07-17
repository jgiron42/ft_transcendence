import Vue from "vue";
import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";
import { Relation } from "@/models/Relation";
import { User } from "@/models/User";

export interface IRelationStore {
	relations: Array<Relation>;
}

@Module({ stateFactory: true, namespaced: true, name: "relation" })
export default class RelationStore extends VuexModule implements IRelationStore {
	public relations: Relation[] = [];

	@Mutation
	setRelations(relations: Relation[]) {
		this.relations = relations;
	}

	@Mutation
	pushRelation(relation: Relation) {
		const index = this.relations.findIndex((r) => r.id === relation.id);
		if (index !== -1) {
			this.relations[index] = relation;
		} else {
			this.relations.push(relation);
		}
	}

	@Mutation
	removeRelation(relation: Relation) {
		this.relations = this.relations.filter((m) => m.id !== relation.id);
	}

	@Action
	async retrieveRelations() {
		await Vue.prototype.api.get("/relations", { page: 1, per_page: 100 }, (r: { data: Relation[] }) => {
			const relations = [] as Relation[];
			r.data.forEach((relation: Relation) => {
				relations.push(relation);
			});
			this.setRelations(relations);
		});
	}

	@Action
	async retrieveRelation(id: number) {
		await Vue.prototype.api.get(`/relations/${id}`, {}, (r: { data: Relation }) => {
			this.pushRelation(r.data);
		});
	}

	@Action
	async addFriend(user: User): Promise<void> {
		await Vue.prototype.api.post(
			`/users/${user.id}/invite_friend`,
			undefined,
			undefined,
			(r: { data: Relation }) => {
				this.pushRelation(r.data);
			},
		);
	}

	@Action
	async removeFriend(relation: Relation): Promise<void> {
		await Vue.prototype.api.delete("/relations/" + relation.id, undefined, () => {
			this.removeRelation(relation);
		});
	}

	@Action
	async acceptFriend(id: number): Promise<void> {
		await Vue.prototype.api.post(`/relations/${id}/accept_friend`, {}, {}, (r: { data: Relation }) => {
			this.pushRelation(r.data);
		});
	}
}
