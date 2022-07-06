import Vue from "vue";
import { User } from "@/models/User";
import { Channel } from "@/models/Channel";
import { chatStore } from "@/store/";
import { ChanConnection } from "@/models/ChanConnection";

// import { User } from "@/models/User";
// import { Message } from "@/models/Message";

interface chatInterface {
	whoAmI(): Promise<User | undefined>;
	createChannel(chan: Channel): void;
	joinChannel(chan: Channel): Promise<Channel | undefined>;
	getVisibleChannels(): void;
	getMyChannels(): void;
	getChanConnections(): Promise<Array<ChanConnection> | undefined>;
}

declare module "vue/types/vue" {
	interface Vue {
		chat: chatInterface;
	}
}

Vue.prototype.chat = <chatInterface>{
	async whoAmI(): Promise<User | undefined> {
		let ret;
		await Vue.prototype.api.get("/me", null, (r: { data: User }) => {
			chatStore.updateMe(r.data);
			ret = chatStore.me;
		});
		return ret;
	},
	async createChannel(chan: Channel) {
		await Vue.prototype.api.post("/channels", chan, null, (chan: Channel) => {
			this.joinChannel(chan);
		});
	},
	async joinChannel(chan: Channel): Promise<Channel | undefined> {
		let ret: Channel | undefined;
		await Vue.prototype.api.post(
			"/channels/" + chan.id + "/join",
			null,
			null,
			(d = { data: { channel: new Channel() } }) => {
				ret = d.data.channel;
			},
		);
		if (ret !== undefined) {
			await Vue.prototype.api.get("/channels/" + chan.id, null, (d = { data: new Channel() }) => {
				ret = d.data;
				chatStore.updateCurrentChannel(d.data);
				this.getChanConnections();
			});
		}
		return ret;
	},
	async getVisibleChannels() {
		await Vue.prototype.api.get("/channels", null, (r: { data: Channel[] }) => {
			if (r.data instanceof Array) chatStore.updateVisibleChannels(r.data);
		});
	},
	async getMyChannels() {
		const id = await chatStore.me.id;
		await Vue.prototype.api.get("/users/" + id + "/chan_connections", null, (r: { data: ChanConnection[] }) => {
			chatStore.updateMyChannels([] as Channel[]);
			for (const connection of r.data) {
				chatStore.pushMyChannels(connection.channel);
			}
		});
	},
	async getChanConnections(): Promise<Array<ChanConnection> | undefined> {
		let ret: Array<ChanConnection> | undefined;
		if (chatStore.currentChannel.id === undefined) return ret;
		await Vue.prototype.api.get(
			"/channels/" + chatStore.currentChannel.id + "/chan_connections",
			null,
			(r: { data: ChanConnection[] }) => {
				const connections = [] as ChanConnection[];
				r.data.forEach((connection: ChanConnection) => {
					connections.push(connection);
				});
				ret = connections;
				chatStore.updateChanConnections(connections);
			},
		);
		return ret;
	},
};
