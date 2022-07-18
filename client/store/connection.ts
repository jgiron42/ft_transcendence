import Vue from "vue";
import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";
import { ChanConnection } from "@/models/ChanConnection";
import { store } from "@/store";
import { DeepPartial } from "@/types/partial";
import { Channel } from "@/models/Channel";

export interface IConnectionStore {
	chanConnections: Array<ChanConnection>;
}

@Module({ stateFactory: true, namespaced: true, name: "connection" })
export default class ConnectionStore extends VuexModule implements IConnectionStore {
	public chanConnections: ChanConnection[] = [];

	@Mutation
	setChanConnections(chanConnections: ChanConnection[]) {
		this.chanConnections = chanConnections;
	}

	@Mutation
	async pushChanConnection(chanConnection: ChanConnection) {
		const index = this.chanConnections.findIndex((r) => r.id === chanConnection.id);
		if (index !== -1) {
			await this.chanConnections.splice(index, 1, chanConnection);
		} else {
			await this.chanConnections.push(chanConnection);
		}
	}

	@Mutation
	removeChanConnection(chanConnection: ChanConnection) {
		this.chanConnections = this.chanConnections.filter((m) => m.id !== chanConnection.id);
	}

	@Action
	async retrieveChanConnections() {
		if (store.channel.currentChannel.channel?.name === undefined) return;
		await Vue.prototype.api.get(
			`/channels/${store.channel.currentChannel.channel.id}/chan_connections`,
			{ page: 1, per_page: 100 },
			(r: { data: ChanConnection[] }) => {
				const connections = [] as ChanConnection[];
				r.data.forEach((connection: ChanConnection) => {
					if (connection.user.id === store.user.me.id) {
						store.channel.setCurrentRole(connection.role);
					}
					connections.push(connection);
				});
				this.setChanConnections(connections);
			},
		);
	}

	@Action
	async retrieveMyConnections() {
		await Vue.prototype.api.get(
			"/users/" + (await store.user.me.id) + "/chan_connections",
			{ page: 1, per_page: 100 },
			(r: { data: ChanConnection[] }) => {
				store.channel.setMyChannels([] as Channel[]);
				for (const connection of r.data) {
					store.channel.pushMyChannels(connection.channel);
				}
			},
		);
	}

	@Action
	async retrieveChanConnection(id: number) {
		await Vue.prototype.api.get(`/connections/${id}`, {}, async (r: { data: ChanConnection }) => {
			await this.pushChanConnection(r.data);
		});
	}

	@Action
	async retrieveMyConnection(id: number) {
		await Vue.prototype.api.get(`/connections/${id}`, {}, async (r: { data: ChanConnection }) => {
			await store.channel.pushMyChannels(r.data.channel);
		});
	}

	@Action
	async updateChanConnection(connection: DeepPartial<ChanConnection>) {
		await Vue.prototype.api.put(`/connections/${connection.id}`, connection, {}, (r: { data: ChanConnection }) => {
			this.pushChanConnection(r.data);
		});
	}
}
