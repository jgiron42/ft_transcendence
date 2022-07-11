import Vue from "vue";
import { User } from "@/models/User";
import { Channel } from "@/models/Channel";
import { chatStore } from "@/store/";
import { ChanConnection } from "@/models/ChanConnection";
import { Relation } from "@/models/Relation";

class ChatClass extends Vue {
	async whoAmI(): Promise<User | undefined> {
		let ret;
		await this.api.get("/me", undefined, (r: { data: User }) => {
			chatStore.updateMe(r.data);
			ret = chatStore.me;
		});
		return ret;
	}

	async createChannel(chan: Channel) {
		await this.api.post("/channels", chan, undefined, (chan: Channel) => {
			this.joinChannel(chan);
		});
	}

	async joinChannel(chan: Channel): Promise<Channel | undefined> {
		let ret: Channel | undefined;
		await this.api.post(
			"/channels/" + chan.id + "/join",
			undefined,
			undefined,
			(d = { data: { channel: new Channel() } }) => {
				ret = d.data.channel;
			},
		);
		if (ret !== undefined) {
			await this.api.get("/channels/" + chan.id, undefined, (d = { data: new Channel() }) => {
				ret = d.data;
				chatStore.updateCurrentChannel(d.data);
				this.getChanConnections();
			});
		}
		return ret;
	}

	async getVisibleChannels() {
		await this.api.get("/channels", { page: 1, per_page: 100 }, (r: { data: Channel[] }) => {
			if (r.data instanceof Array) chatStore.updateVisibleChannels(r.data);
		});
	}

	async getMyChannels() {
		const id = await chatStore.me.id;
		await this.api.get(
			"/users/" + id + "/chan_connections",
			{ page: 1, per_page: 100 },
			(r: { data: ChanConnection[] }) => {
				chatStore.updateMyChannels([] as Channel[]);
				for (const connection of r.data) {
					chatStore.pushMyChannels(connection.channel);
				}
			},
		);
	}

	async getChanConnections(): Promise<Array<ChanConnection> | undefined> {
		let ret: Array<ChanConnection> | undefined;
		if (chatStore.currentChannel.id === undefined) return ret;
		await this.api.get(
			"/channels/" + chatStore.currentChannel.id + "/chan_connections",
			{ page: 1, per_page: 100 },
			(r: { data: ChanConnection[] }) => {
				const connections = [] as ChanConnection[];
				r.data.forEach((connection: ChanConnection) => {
					if (connection.user.id === chatStore.me.id) {
						chatStore.updateMyRole(connection.role);
					}
					connections.push(connection);
				});
				ret = connections;
				chatStore.updateChanConnections(connections);
			},
		);
		return ret;
	}

	async getRelations(): Promise<Array<Relation> | undefined> {
		let ret: Array<Relation> | undefined;
		await this.api.get("/relations", { page: 1, per_page: 100 }, (r: { data: Relation[] }) => {
			const relations = [] as Relation[];
			r.data.forEach((relation: Relation) => {
				relations.push(relation);
			});
			ret = relations;
			chatStore.updateRelations(relations);
		});
		return ret;
	}
}

declare module "vue/types/vue" {
	interface Vue {
		chat: ChatClass;
	}
}

Vue.prototype.chat = new ChatClass();
