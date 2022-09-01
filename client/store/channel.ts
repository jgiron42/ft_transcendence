import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";
import { Channel, ChannelType } from "@/models/Channel";
import { ChanConnection, ChannelRole } from "@/models/ChanConnection";
import { store } from "@/store";
import { User } from "@/models/User";
import { ChanInvitation } from "@/models/ChanInvitation";
import { DeepPartial } from "@/types/partial";

export interface IChannelStore {
	channels: Map<number, Channel>; // the visible channels to the user
	channelsTracker: Omit<number, 0>; // used to force update the visible channels in frontend
	currentConnection: ChanConnection; // the current channel on which the user is connected
}

@Module({ stateFactory: true, namespaced: true, name: "channel" })
export default class ChannelStore extends VuexModule implements IChannelStore {
	public channels: Map<number, Channel> = new Map<number, Channel>();
	public channelsTracker: Omit<number, 0> = 1;
	public currentConnection: ChanConnection = new ChanConnection();

	// Mutation to clear the channels
	@Mutation
	clearChannels() {
		// clear channels
		this.channels.clear();

		// update channelsTracker in order to force dynamic rendering of channels
		(this.channelsTracker as number)++;
	}

	// Mutation to push channels and force update dynamic rendering
	@Mutation
	pushChannels(channels: Channel[]) {
		for (const channel of channels) this.channels.set(channel.id, channel);

		// update channelsTracker in order to force dynamic rendering of channels
		(this.channelsTracker as number)++;
	}

	// Mutation used to push a channel on channels and my channels and update it if needed.
	@Mutation
	pushChannel(channel: Channel) {
		// check if store.user.connections contain a connection for this channel
		if (Array.from(store.user.connections.values()).find((c) => c.channel.id === channel.id)) {
			this.channels.set(channel.id, channel);
			store.user.updateConnectionByChannel(channel);
		}
		// if the channel is not on my channels and it's not a private channel, then push it on channels
		else if (channel.type !== ChannelType.PRIVATE) this.channels.set(channel.id, channel);
		// else remove it from channels
		else this.channels.delete(channel.id);

		// if the channel pushed is the current channel, then update current channel.
		if (channel.id === this.currentConnection.channel.id) this.currentConnection.channel = channel;

		// update channelsTracker in order to force dynamic rendering of channels
		(this.channelsTracker as number)++;
	}

	// function to remove a channel from channels and force update dynamic rendering
	@Mutation
	removeChannel(channel: Channel) {
		this.channels.delete(channel.id);

		// if the channel removed is the current channel, then update current channel.
		if (channel.id === this.currentConnection.channel.id) this.currentConnection = new ChanConnection();

		// update channelsTracker in order to force dynamic rendering of channels
		(this.channelsTracker as number)++;
	}

	// function to retrieve from api all visible channels
	@Action
	async retrieveChannels(page = 1) {
		// if retrieving the first page, then clear the channels
		if (page === 1) this.clearChannels();

		// getting channels from api
		await window.$nuxt.$axios
			.get("/channels", { params: { page, per_page: 100 } })
			.then((response) => {
				// check if the response data isn't empty
				if (response.data.length === undefined) return;

				// push the channels to the store
				this.pushChannels(response.data);

				// if it's not the first page, then trying to retrieve the next page
				if (response.data.length === 100) this.retrieveChannels(page + 1);
			})
			.catch(() => {
				window.$nuxt.$emit("addAlert", {
					title: "Error:",
					message: "An error occured while retrieving channels.",
				});
			});
	}

	// Action to retrieve a channel by id
	@Action
	async retrieveChannel(id: number) {
		await window.$nuxt.$axios
			.get(`/channels/${id}`)
			.then((response) => {
				// push the channel retrieved
				this.pushChannel(response.data);
			})
			.catch(() => {
				window.$nuxt.$emit("addAlert", {
					title: "Error:",
					message: "An error occured while retrieving channel.",
				});
			});
	}

	// Action to join a channel
	@Action
	async joinChannel(channel: Channel) {
		await window.$nuxt.$axios
			.post(`/channels/${channel.id}/join`, null, {
				params: { password: channel.password },
			})
			.then((response) => {
				// if the user is banned from the joined channel then show an alert.
				if (response.data.role === ChannelRole.BANNED) {
					window.$nuxt.$emit("addAlert", {
						title: "Error:",
						message: "You are banned from this channel.",
					});
					return;
				}

				// update the current channel connection
				this.setCurrentConnection(response.data);

				// emit a message through socket to inform the user has joined the channel
				window.$nuxt.$chatSocket.getSocket()?.emit("chat:JoinChannel", channel.id);

				// retrieve the channel connections
				store.connection.retrieveChanConnections();

				// reset the messages
				store.message.setMessages([]);

				// ensure the joined channel is on channels
				this.pushChannels([response.data.channel]);
			})
			.catch((error) => {
				window.$nuxt.$emit("addAlert", { title: "Error:", message: error.response.data.message });
			});
	}

	// Action to leave a channel
	@Action
	async leaveChannel(chanId: number) {
		await window.$nuxt.$axios
			.post(`/channels/${chanId}/leave`)
			.then(() => {
				// if the leaved channel is the current channel,
				// then reset the current connection to inform frontend we aren't in channel anymore.
				// and reset the channel connections
				if (chanId === this.currentConnection.channel.id) {
					this.setCurrentConnection(new ChanConnection());
					store.connection.clearChanConnections();
				}
			})
			.catch(() => {
				window.$nuxt.$emit("addAlert", {
					title: "Error:",
					message: "You can't leave this channel.",
				});
			});
	}

	// Action to create a new channel
	@Action
	async createChannel(channel: Channel) {
		await window.$nuxt.$axios
			.post("/channels", channel)
			.then((response) => {
				// ensure the channel is valid in order to join it.
				if (response.data.id) this.joinChannel(channel);
			})
			.catch((error) => {
				window.$nuxt.$emit("addAlert", { title: "Error:", message: error.response.data.message });
			});
	}

	// action to edit a channel
	@Action
	async updateChannel(channel: Channel) {
		await window.$nuxt.$axios
			.put(`/channels/${channel.id}`, channel)
			.then((response) => {
				// update current channel (because we can edit only the current channel).
				if (channel.id === this.currentConnection.channel.id) {
					this.setCurrentChannel(response.data);
				}
			})
			.catch(() => {
				window.$nuxt.$emit("addAlert", { title: "Error:", message: "Une erreur est survenue" });
			});
	}

	// Mutation to set the current channel connection
	@Mutation
	setCurrentConnection(connection: ChanConnection) {
		this.currentConnection = connection;
	}

	// Mutation to set the current channel of current connection
	@Mutation
	setCurrentChannel(channel: Channel) {
		this.currentConnection.channel = channel;
	}

	// Mutation to set the current role of current connection
	@Mutation
	setCurrentRole(role: ChannelRole) {
		this.currentConnection.role = role;
	}

	// Action to join a dm channel with a user
	@Action
	async sendDm(user: User) {
		await window.$nuxt.$axios
			.get(`/users/${user.id}/dm`)
			.then((response) => {
				// join the dm channel
				this.joinChannel(response.data);
			})
			.catch(() => {
				window.$nuxt.$emit("addAlert", {
					title: "Error:",
					message: `Failed to send direct message to ${user.username}`,
				});
			});
	}

	// Action to invite a user to a channel
	@Action
	async invite(invitation: DeepPartial<ChanInvitation>) {
		// if invitation contain a channel and a user, then invite the user to the channel
		if (invitation.channel && invitation.user)
			await window.$nuxt.$axios
				.post(`/channels/${invitation.channel.id}/invite/${invitation.user.id}`)
				.then((_) =>
					window.$nuxt.alert.emit({ title: "CHANNEL", message: "Invite successfully sent.", isError: false }),
				)
				.catch(() => {
					window.$nuxt.$emit("addAlert", {
						title: "Error:",
						message: "Failed to invite user to channel.",
					});
				});
	}
}
