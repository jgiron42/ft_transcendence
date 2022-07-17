import Vue from "vue";
import { store } from "@/store";
import { Channel } from "@/models/Channel";
import { ChanConnection } from "@/models/ChanConnection";

export class ChanConnectionPlugin extends Vue {
	async getUserChanConnections() {
		await this.api.get(
			"/users/" + (await store.chat.me.id) + "/chan_connections",
			{ page: 1, per_page: 100 },
			(r: { data: ChanConnection[] }) => {
				store.chat.updateMyChannels([] as Channel[]);
				for (const connection of r.data) {
					store.chat.pushMyChannels(connection.channel);
				}
			},
		);
	}
}
