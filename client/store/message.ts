import { VuexModule, Module, Mutation } from "vuex-module-decorators";
import { Message } from "@/models/Message";

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
}
