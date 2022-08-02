import { VuexModule, Module, Mutation } from "vuex-module-decorators";
import { User } from "@/models/User";
import { Channel, ChannelType } from "@/models/Channel";
import { ChanConnection } from "@/models/ChanConnection";
import { store } from "@/store";

export interface IUserStore {
	me: User;
	connections: Map<number, ChanConnection>; // map of current channel's connections
	connectionsTracker: Omit<number, 0>; // used to force update the channel connections in frontend
}

@Module({ stateFactory: true, namespaced: true, name: "user" })
export default class UserStore extends VuexModule implements IUserStore {
	public connections: Map<number, ChanConnection> = new Map<number, ChanConnection>();
	public connectionsTracker: Omit<number, 0> = 1;

	me: User = new User();

	getUser(): User {
		return this.me;
	}

	@Mutation
	setUser(user: User) {
		this.me = user;
	}

	// Mutation to push user's connections and force update dynamic rendering
	@Mutation
	pushConnections(connections: ChanConnection[]) {
		for (const connection of connections) this.connections.set(connection.id, connection);

		// update connectionTracker in order to force dynamic rendering of connections
		(this.connectionsTracker as number)++;
	}

	// Mutation to remove a connection
	@Mutation
	removeConnection(connection: ChanConnection) {
		if (!this.connections.delete(connection.id)) return;

		// if the channel of the connection is the current channel, then update the current channel
		if (connection.channel.id === store.channel.currentConnection.channel.id)
			store.channel.setCurrentConnection(new ChanConnection());

		// if the channel of the connection is a private channel, then remove it from visible channels
		if (connection.channel.type === ChannelType.PRIVATE) store.channel.removeChannel(connection.channel);

		// update connectionTracker in order to force dynamic rendering of connections
		(this.connectionsTracker as number)++;
	}

	// Mutation to update a channel in a connection
	@Mutation
	updateConnectionByChannel(channel: Channel) {
		for (const connection of this.connections.values()) {
			if (connection.channel.id === channel.id) {
				connection.channel = channel;
			}
		}
		// update connectionTracker in order to force dynamic rendering of connections
		(this.connectionsTracker as number)++;
	}

	// Mutation to clear user's connections
	@Mutation
	clearConnections() {
		// clear connections
		this.connections.clear();

		// update connectionTracker in order to force dynamic rendering of connections
		(this.connectionsTracker as number)++;
	}
}
