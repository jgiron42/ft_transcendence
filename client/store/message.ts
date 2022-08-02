import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";
import { Message } from "@/models/Message";
import { store } from "@/store";
import { DeepPartial } from "@/types/partial";

export interface IMessageStore {
	messages: Message[]; // list of messages
	loadMessagePromise: Promise<void>; // promise used to ensure that the retrieveMessages mutation is not called multiple times at the same time
}

@Module({ stateFactory: true, namespaced: true, name: "message" })
export default class MessageStore extends VuexModule implements IMessageStore {
	public messages: Message[] = [];
	public loadMessagePromise: Promise<void> = Promise.resolve();

	// Mutation to set the messages list
	@Mutation
	setMessages(messages: Message[]) {
		// we construct a new Date based on the created_at field of the message
		// ensuring we can call getTime() on it (created_at is a string when message retrieved from api).
		this.messages = messages.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
	}

	// Mutation used when retrieveing messages from api
	@Mutation
	pushFront(messages: Message[]) {
		this.messages = messages.concat(this.messages);
	}

	// Mutation to add a message to the messages list
	@Mutation
	addMessage(message: Message) {
		this.messages.push(message);
	}

	// Mutation to remove a message from the messages list
	@Mutation
	removeMessage(message: Message) {
		this.messages = this.messages.filter((m) => m.id !== message.id);
	}

	// Action used to post a message to the api
	@Action
	async sendMessage(message: DeepPartial<Message>) {
		// ensure we are on a channel
		if (!store.channel.currentConnection.channel) return;

		// check if connection on channels is mine and muted
		for (const connection of store.connection.chanConnections.values()) {
			if (
				// check if the channel of connection is the same as the current channel
				connection.channel.id === store.channel.currentConnection.channel.id &&
				// check if the connection is mine
				connection.user.id === store.user.me.id &&
				// ensure to be able to call getTime() by instantiating a new Date based on mute_end (mute_end is a string when retrieved from api).
				new Date(connection.mute_end).getTime() > Date.now()
			) {
				window.$nuxt.$emit("addAlert", {
					type: "Error",
					message: "You are muted on this channel",
				});
				return;
			}
		}
		// send message to api
		await window.$nuxt.$axios
			.post(`/channels/${store.channel.currentConnection.channel.id}/messages`, message)
			// if catch an error, display an alert
			.catch(() => {
				window.$nuxt.$emit("addAlert", {
					type: "Error",
					message: "Failed to send message",
				});
			});
	}

	// Action used to retrieve a message from the api
	@Action
	async retrieveMessage(id: number) {
		await window.$nuxt.$axios
			.get(`/messages/${id}`)
			.then((response) => {
				// add message to list
				this.addMessage(response.data);
			})
			// if catch an error, display an alert
			.catch(() => {
				window.$nuxt.$emit("addAlert", {
					type: "Error",
					message: "Failed to retrieve message",
				});
			});
	}

	// Mutation to update the state of loadMessagePromise
	@Mutation
	updateLoadMessagePromise(promise: Promise<void>) {
		this.loadMessagePromise = promise;
	}

	@Action
	async retrieveMessages(chanId: number) {
		// first, wait for the previous promise to be resolved
		await this.loadMessagePromise;

		this.updateLoadMessagePromise(
			this.loadMessagePromise.then(async () => {
				// get the current date
				let date = new Date(Date.now());

				// if there are messages, get the date of older messages
				if (this.messages.length > 0) {
					date = this.messages[0].created_at;
				}

				// retrieve messages older than $date from api
				await window.$nuxt.$axios
					.get(`/channels/${chanId}/messages`, {
						params: { date, per_page: 5 },
					})
					.then((response) => {
						// if response is empty, return
						if (response.data.length === undefined) return;

						const messages = response.data.sort(
							// ensure messages are sorted by date
							// - here, we construct a new Date based on the created_at field of the message
							//   ensuring we can call getTime() on it (created_at is a string when message retrieved from api).
							(a: Message, b: Message) =>
								new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
						);

						// add messages to list
						this.pushFront(messages);
					})
					// if catch an error, display an alert
					.catch(() => {
						window.$nuxt.$emit("addAlert", {
							type: "Error",
							message: "Failed to retrieve messages",
						});
					});

				// Finally resolve the promise
				// - this will allow the next call to retrieveMessages to continue
				return Promise.resolve();
			}),
		);
		return this.loadMessagePromise;
	}
}
