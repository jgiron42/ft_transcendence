import Vue from "vue";
import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";
import { Message } from "@/models/Message";
import { store } from "@/store";
import { DeepPartial } from "@/types/partial";

export interface IMessageStore {
	messages: Array<Message>;
	loadMessagePromise: Promise<void>;
}

@Module({ stateFactory: true, namespaced: true, name: "message" })
export default class MessageStore extends VuexModule implements IMessageStore {
	public messages: Message[] = [];
	public loadMessagePromise: Promise<void> = Promise.resolve();

	@Mutation
	setMessages(messages: Message[]) {
		this.messages = messages.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
	}

	@Mutation
	pushFrontMessages(messages: Message[]) {
		this.messages = [...messages, ...this.messages];
	}

	@Mutation
	addMessage(message: Message) {
		this.messages.push(message);
	}

	@Mutation
	removeMessage(message: Message) {
		this.messages = this.messages.filter((m) => m.id !== message.id);
	}

	@Action
	async sendMessage(message: DeepPartial<Message>) {
		if (store.channel.currentChannel.channel)
			await Vue.prototype.api.post(`/channels/${store.channel.currentChannel.channel.id}/messages`, message);
	}

	@Action
	async retrieveMessage(id: number) {
		let ret = new Message();
		await Vue.prototype.api.get(`/messages/${id}`, {}, (response: { data: Message }) => {
			this.addMessage(response.data);
			ret = response.data;
		});
		return ret;
	}

	@Mutation
	updateLoadMessagePromise(promise: Promise<void>) {
		this.loadMessagePromise = promise;
	}

	@Action
	async retrieveMessages(chanId: number) {
		await this.loadMessagePromise;
		this.updateLoadMessagePromise(
			this.loadMessagePromise.then(async () => {
				let date = new Date(Date.now());
				if (store.message.messages.length > 0) {
					date = store.message.messages[0].created_at;
				}
				await Vue.prototype.api.get(
					`/channels/${chanId}/messages`,
					{ date, per_page: 10 },
					(response: { data: Message[] }) => {
						const messages = response.data.sort(
							(a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
						);
						store.message.pushFrontMessages(messages);
					},
				);
				return Promise.resolve();
			}),
		);
		return this.loadMessagePromise;
	}
}
