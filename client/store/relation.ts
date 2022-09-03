import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";
import { Relation, RelationType } from "@/models/Relation";
import { User } from "@/models/User";

export interface IRelationStore {
	relations: Relation[];
}

@Module({ stateFactory: true, namespaced: true, name: "relation" })
export default class RelationStore extends VuexModule implements IRelationStore {
	public relations: Relation[] = [];

	// Mutation to set the relations
	@Mutation
	setRelations(relations: Relation[]) {
		this.relations = relations;
	}

	// Mutation used when retrieving relations from api
	@Mutation
	pushFront(relations: Relation[]) {
		this.relations = relations.concat(this.relations);
	}

	// Mutation to push or update a relation
	@Mutation
	async pushRelation(relation: Relation) {
		const index = this.relations.findIndex((r) => r.id === relation.id);

		if (index !== -1) await this.relations.splice(index, 1, relation);
		else await this.relations.push(relation);
	}

	// Mutation to remove a relation
	@Mutation
	removeRelation(relation: Relation) {
		this.relations = this.relations.filter((m) => m.id !== relation.id);
	}

	// Action to retrieve relations from api
	@Action
	async retrieveRelations() {
		// clear relations
		this.setRelations([]);

		let page = 1;
		let stop = false;

		while (!stop) {
			await window.$nuxt.$axios
				.get("/relations", { params: { page, per_page: 100 } })
				.then((response) => {
					// ensure the response is not empty
					if (response.data.length === undefined) {
						stop = true;
						return;
					}

					// add relations to store
					this.pushFront(response.data);
					page++;

					// if there are more relations to retrieve, retrieve them
					if (response.data.length !== 100) stop = true;
				})
				// if catch some errors, add an alert
				.catch(() => {
					window.$nuxt.$emit("addAlert", {
						type: "Error",
						message: "Failed to retrieve relations.",
					});
					stop = true;
				});
		}
	}

	// Action to retrieve a relation from api
	@Action
	async retrieveRelation(id: number) {
		await window.$nuxt.$axios
			.get(`/relations/${id}`)
			.then((response) => {
				// add relation to store
				this.pushRelation(response.data);
			})
			// if catch some errors, add an alert
			.catch(() => {
				window.$nuxt.$emit("addAlert", {
					type: "Error",
					message: "Failed to retrieve relation.",
				});
			});
	}

	// Action to send a friend request
	@Action
	async addFriend(user: User): Promise<void> {
		await window.$nuxt.$axios
			.post(`/users/${user.id}/invite_friend`)
			.then((response) => {
				// add relation to store
				this.pushRelation(response.data);
			})
			// if catch some errors, add an alert
			.catch(() => {
				window.$nuxt.$emit("addAlert", {
					type: "Error",
					message: "Failed to add friend.",
				});
			});
	}

	// Action to remove a friend / friend request
	@Action
	async removeFriend(relation: Relation): Promise<void> {
		await window.$nuxt.$axios
			.delete("/relations/" + relation.id)
			.then(() => {
				// remove relation from store
				this.removeRelation(relation);
			})
			// if catch some errors, add an alert
			.catch(() => {
				window.$nuxt.$emit("addAlert", {
					type: "Error",
					message: "Failed to remove relation.",
				});
			});
	}

	// Action to accept a friend request
	@Action
	async acceptFriend(id: number): Promise<void> {
		await window.$nuxt.$axios.post(`/relations/${id}/accept_friend`).catch(() => {
			window.$nuxt.$emit("addAlert", {
				type: "Error",
				message: "Failed to accept friend.",
			});
		});
	}

	// Action to block a user
	@Action
	async blockUser(user: User) {
		await window.$nuxt.$axios.post(`/users/${user.id}/block`).catch(() => {
			window.$nuxt.$emit("addAlert", {
				type: "Error",
				message: "Failed to block user.",
			});
		});
	}

	// Action to unblock a user
	@Action
	async unblockUser(user: User) {
		// get if the user is blocked
		const index = this.relations.findIndex((r) => r.target.id === user.id && r.type === RelationType.BLOCK);

		// if not found, return
		if (index === -1) return;

		await window.$nuxt.$axios.delete(`/relations/${this.relations[index].id}`).catch(() => {
			window.$nuxt.$emit("addAlert", {
				type: "Error",
				message: "Failed to remove relation.",
			});
		});
	}
}
