import Vue from "vue";
import { chatStore } from "@/store";
import { Channel } from "@/models/Channel";
import { ChanConnection } from "@/models/ChanConnection";

export class ChanConnectionPlugin extends Vue {
	async getUserChanConnections() {
		await this.api.get(
			"/users/" + (await chatStore.me.id) + "/chan_connections",
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
}
