import Vue from "vue";
import { User } from "@/models/User";
import { Channel } from "@/models/Channel";
import { chatStore } from "@/store/";

// import { User } from "@/models/User";
// import { Message } from "@/models/Message";

interface chatInterface {
	whoAmI(): Promise<User | undefined>;
	createChannel(chan: Channel): void;
	joinChannel(chan: Channel): Promise<Channel | undefined>;
	getChannels(): Promise<Channel | undefined>;
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
		// Vue.prototype
		await Vue.prototype.api.post("/channels", chan, null, (chan: Channel) => {
			this.joinChannel(chan);
		});
	},
	async joinChannel(chan: Channel): Promise<Channel | undefined> {
		let ret;
		await Vue.prototype.api.post(
			"/channels/" + chan.id + "/join",
			null,
			null,
			(d = { data: { channel: Channel } }) => {
				ret = d.data.channel;
			},
		);
		return ret;
	},
	async getChannels(): Promise<Channel | undefined> {
		let ret;
		await Vue.prototype.api.get("/channels", null, (r: { data: Channel[] }) => {
			chatStore.updateChannels(r.data);
		});
		return ret;
	},
};
