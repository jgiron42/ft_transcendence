import Vue from "vue";
import { store } from "@/store";
import { Channel } from "@/models/Channel";
import { ChanConnection } from "@/models/ChanConnection";

type PartialConnection<T> = T extends object
	? {
			[P in keyof T]?: PartialConnection<T[P]>;
	  }
	: T;

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

	async getChanConnections(): Promise<Array<ChanConnection> | undefined> {
		let ret: Array<ChanConnection> | undefined;
		if (store.chat.currentChannel.id === undefined) return ret;
		await this.api.get(
			"/channels/" + store.chat.currentChannel.id + "/chan_connections",
			{ page: 1, per_page: 100 },
			(r: { data: ChanConnection[] }) => {
				const connections = [] as ChanConnection[];
				r.data.forEach((connection: ChanConnection) => {
					if (connection.user.id === store.chat.me.id) {
						store.chat.updateMyRole(connection.role);
					}
					connections.push(connection);
				});
				ret = connections;
				store.chat.updateChanConnections(connections);
			},
		);
		return ret;
	}

	async updateChanConnection(connection: PartialConnection<ChanConnection>): Promise<ChanConnection | undefined> {
		let ret: ChanConnection | undefined;
		await this.api.put("/connections/" + connection.id, connection, undefined, (r: { data: ChanConnection }) => {
			ret = r.data;
			store.chat.pushChanConnection(ret);
		});
		return ret;
	}
}
