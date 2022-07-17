import Vue from "vue";
import { store } from "@/store";
import { Relation } from "@/models/Relation";
import { User } from "@/models/User";

export class RelationPlugin extends Vue {
	//	async getRelations(): Promise<Array<Relation> | undefined> {
	//		let ret: Array<Relation> | undefined;
	//		await this.api.get("/relations", { page: 1, per_page: 100 }, (r: { data: Relation[] }) => {
	//			const relations = [] as Relation[];
	//			r.data.forEach((relation: Relation) => {
	//				if (relation.type === RelationType.BLOCK) store.chat.pushBlockedUsers(relation);
	//				else relations.push(relation);
	//			});
	//			ret = relations;
	//			store.chat.updateRelations(relations);
	//		});
	//		return ret;
	//	}

	async acceptFriend(id: number): Promise<void> {
		await this.api.post("/relations/" + id + "/accept_friend");
	}

	async blockUser(user: User): Promise<void> {
		await this.api.post("/users/" + user.id + "/block", undefined, undefined, (r: { data: Relation }) => {
			this.api.get("/relations/" + r.data.id, undefined, (_r: { data: Relation }) => {
				store.chat.pushBlockedUsers(_r.data as Relation);
			});
			Vue.prototype.$socket.getSocket()?.emit("JC", store.chat.currentChannel.id);
		});
	}

	async unblockUser(user: User): Promise<void> {
		const index = store.chat.blockedUsers.findIndex((r: Relation) => r.target.id === user.id);
		if (index !== -1) {
			await this.api.delete("/relations/" + store.chat.blockedUsers[index].id, undefined, () => {
				store.chat.spliceBlockedUsers(index);
				Vue.prototype.$socket.getSocket()?.emit("JC", store.chat.currentChannel.id);
			});
		}
	}
}
