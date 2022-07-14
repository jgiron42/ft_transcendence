import Vue from "vue";
import { chatStore } from "@/store";
import { Relation, RelationType } from "@/models/Relation";
import { User } from "@/models/User";

export default class RelationPlugin extends Vue {
	async getRelations(): Promise<Array<Relation> | undefined> {
		let ret: Array<Relation> | undefined;
		await this.api.get("/relations", { page: 1, per_page: 100 }, (r: { data: Relation[] }) => {
			const relations = [] as Relation[];
			r.data.forEach((relation: Relation) => {
				if (relation.type === RelationType.BLOCK) chatStore.pushBlockedUsers(relation);
				else relations.push(relation);
			});
			ret = relations;
			chatStore.updateRelations(relations);
		});
		return ret;
	}

	async addFriend(user: User): Promise<void> {
		await this.api.post("/users/" + user.id + "/invite_friend", undefined, undefined, () => {
			this.getRelations();
		});
	}

	async acceptFriend(id: number): Promise<void> {
		await this.api.post("/relations/" + id + "/accept_friend");
	}

	async removeFriend(relation: Relation): Promise<void> {
		await this.api.delete("/relations/" + relation.id);
	}

	async blockUser(user: User): Promise<void> {
		await this.api.post("/users/" + user.id + "/block", undefined, undefined, (r: { data: Relation }) => {
			this.api.get("/relations/" + r.data.id, undefined, (_r: { data: Relation }) => {
				chatStore.pushBlockedUsers(_r.data as Relation);
			});
			Vue.prototype.$socket.getSocket()?.emit("JC", chatStore.currentChannel.id);
		});
	}

	async unblockUser(user: User): Promise<void> {
		const index = chatStore.blockedUsers.findIndex((r: Relation) => r.target.id === user.id);
		if (index !== -1) {
			await this.api.delete("/relations/" + chatStore.blockedUsers[index].id, undefined, () => {
				chatStore.spliceBlockedUsers(index);
				Vue.prototype.$socket.getSocket()?.emit("JC", chatStore.currentChannel.id);
			});
		}
	}
}
