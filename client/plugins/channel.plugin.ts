import Vue from "vue";
import { chatStore } from "@/store";
import { Channel } from "@/models/Channel";
import { ChannelRole } from "@/models/ChanConnection";

export class ChannelPlugin extends Vue {
	async joinChannel(chan: Channel, password?: string, onSuccess?: Function): Promise<Channel | undefined> {
		let ret: Channel | undefined;
		let isBanned = false;
		await this.api.post(
			"/channels/" + chan.id + "/join",
			undefined,
			{ password },
			(d = { data: { channel: new Channel(), role: ChannelRole.USER } }) => {
				ret = d.data.channel;
				if (d.data.role === ChannelRole.BANNED) {
					isBanned = true;
				}
			},
		);
		if (isBanned) {
			return undefined;
		}
		if (ret !== undefined) {
			await this.api.get("/channels/" + chan.id, undefined, (d = { data: new Channel() }) => {
				ret = d.data;
				chatStore.updateCurrentChannel(d.data);
				this.chat.chanConnection.getChanConnections();
			});
			Vue.prototype.$socket.getSocket()?.emit("JC", ret.id);
			this.$nuxt.$emit("updateChannels");
			onSuccess?.();
		}
		return ret;
	}

	async leaveChannel(chan: Channel) {
		await this.api.post("/channels/" + chan.id + "/leave", undefined, undefined, () => {
			if (chan.id === chatStore.currentChannel.id) {
				chatStore.resetCurrentChannel();
			}
			chatStore.leaveChannel(chan.id);
		});
	}

	async createChannel(chan: Channel) {
		await this.api.post("/channels", chan, undefined, (chan: Channel) => {
			this.joinChannel(chan);
		});
	}

	async getChannels() {
		await this.api.get("/channels", { page: 1, per_page: 100 }, (r: { data: Channel[] }) => {
			if (r.data instanceof Array) chatStore.updateVisibleChannels(r.data);
		});
	}

	async updateChannel(chan: Channel): Promise<boolean> {
		let ret = false;
		await this.api.put("/channels/" + chan.id, chan, undefined, () => {
			ret = true;
		});
		return ret;
	}
}
