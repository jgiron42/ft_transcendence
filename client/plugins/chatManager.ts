import Vue from "vue";
import { Channel } from "@/models/Channel";
import { chatStore } from "@/store/";

// import { User } from "@/models/User";
// import { Message } from "@/models/Message";

interface chatInterface {
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
