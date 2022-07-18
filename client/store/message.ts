import Vue from "vue";
import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";
import { Message } from "@/models/Message";
import { store } from "@/store";
import { DeepPartial } from "@/types/partial";

export interface IMessageStore {
	messages: Array<Message>;
}

@Module({ stateFactory: true, namespaced: true, name: "message" })
export default class MessageStore extends VuexModule implements IMessageStore {
	public messages: Message[] = [];

	@Mutation
	setMessages(messages: Message[]) {
		this.messages = messages;
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
			this.context.commit("addMessage", response.data);
			ret = response.data;
		});
		return ret;
	}
}
