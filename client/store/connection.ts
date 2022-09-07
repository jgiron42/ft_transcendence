import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";
import { ChanConnection } from "@/models/ChanConnection";
import { store } from "@/store";
import { DeepPartial } from "@/types/partial";

export interface IConnectionStore {
	chanConnections: Map<number, ChanConnection>; // map of current channel's connections
	chanConnectionTracker: Omit<number, 0>; // used to force update the channel connections in frontend
}

@Module({ stateFactory: true, namespaced: true, name: "connection" })
export default class ConnectionStore extends VuexModule implements IConnectionStore {
	public chanConnections: Map<number, ChanConnection> = new Map<number, ChanConnection>();
	public chanConnectionTracker: Omit<number, 0> = 1;

	// Mutation used to push a connection and update it if needed
	@Mutation
	pushChanConnection(connections: ChanConnection[]) {
		for (const connection of connections) this.chanConnections.set(connection.id, connection);

		// force update the channel connections in frontend
		(this.chanConnectionTracker as number)++;
	}

	// Mutation used to remove a connection
	@Mutation
	removeChanConnection(connection: ChanConnection) {
		// remove the connection from the list of my channels
		if (connection.user.id === store.user.me.id) store.user.removeConnection(connection);

		// remove the connection on the current channel
		this.chanConnections.delete(connection.id);

		// force update the channel connections in frontend
		(this.chanConnectionTracker as number)++;
	}

	// Mutation used to clear the current channel's connections
	@Mutation
	clearChanConnections() {
		this.chanConnections.clear();

		// force update the channel connections in frontend
		(this.chanConnectionTracker as number)++;
	}

	// Action used to retrieve all chanConnections of the current channel from api
	@Action
	async retrieveChanConnections() {
		// if we aren't on a channel, then simply return
		if (store.channel.currentConnection.channel?.id === undefined) return;

		// clear the current channel connections
		this.clearChanConnections();

		let page = 1;
		let stop = false;

		while (!stop) {
			await window.$nuxt.$axios
				.get(`/channels/${store.channel.currentConnection.channel.id}/chan_connections`, {
					params: { page, per_page: 100 },
				})
				.then((response) => {
					// get connections from data
					const connections: ChanConnection[] = response.data;

					// get my connection on the current channel
					const myConnection = connections.find((c) => c.user.id === store.user.me.id);

					// if my connection is found, update my role on current channel and push the channel to my channels
					if (myConnection) {
						store.channel.setCurrentRole(myConnection.role);
						store.user.pushConnections([myConnection]);
					}

					// push connections to the list
					this.pushChanConnection(connections);
					page++;

					// if it's the last page, then stop the loop
					if (connections.length !== 100) stop = true;
				})
				.catch(() => {
					// if error occurs, add an alert
					window.$nuxt.$emit("addAlert", {
						title: "Error",
						message: "Failed to retrieve channel connections",
					});
					stop = true;
				});
		}
	}

	// Action used to retrieve all the channel connections of the current user
	@Action
	async retrieveMyConnections() {
		// clear the my connections
		store.user.clearConnections();

		let page = 1;
		let stop = false;

		while (!stop) {
			await window.$nuxt.$axios
				.get(`/users/${store.user.me.id}/chan_connections`, {
					params: { page, per_page: 100 },
				})
				.then((response) => {
					// get connections from response data
					const connections: ChanConnection[] = response.data;

					// check if connections is not empty
					if (connections.length === undefined) {
						stop = true;
						return;
					}

					// push channel of the connections to my channels
					store.user.pushConnections(connections);
					page++;

					// if it's the last page, then stop the loop
					if (connections.length !== 100) stop = true;
				})
				.catch(() => {
					// if error occurs, add an alert
					window.$nuxt.$emit("addAlert", {
						title: "Error",
						message: "Failed to retrieve user connections",
					});
					stop = true;
				});
		}
	}

	// Action used to retrieve a connection by id
	@Action
	retrieveConnection(id: number) {
		window.$nuxt.$axios
			.get(`/connections/${id}`)
			.then((response) => {
				// if it's connection is mine, push the channel of the connection to my channels
				if (response.data.user.id === store.user.me.id) store.user.pushConnections([response.data]);

				// push the connection to the list of channelconnections
				if (response.data.channel.id === store.channel.currentConnection.channel.id)
					this.pushChanConnection([response.data]);
			})
			.catch(() => {
				// if error occurs, add an alert
				window.$nuxt.$emit("addAlert", {
					title: "Error",
					message: "Failed to retrieve channel connection",
				});
			});
	}

	// Action used to update a connection (for mute / ban etc)
	@Action
	updateChanConnection(connection: DeepPartial<ChanConnection>) {
		window.$nuxt.$axios.put(`/connections/${connection.id}`, connection).catch(() => {
			// if error occurs, add an alert
			window.$nuxt.$emit("addAlert", {
				title: "Error",
				message: "Failed to update channel connection",
			});
		});
	}

	// Action used to kick a connection
	@Action
	kickChanConnection(connection: ChanConnection) {
		window.$nuxt.$axios.post(`/channels/${connection.channel.id}/kick/${connection.user.id}`);
	}
}
