import Vue from "vue";
import { store } from "@/store";
import { Message } from "@/models/Message";
import { Relation } from "@/models/Relation";

export class MessagePlugin extends Vue {
	async getMessage(message: Message): Promise<void> {
		// check if message.user isn't blocked
		if (!store.chat.blockedUsers.find((r: Relation) => r.target.id === message.user)) {
			await this.api.get("/messages/" + message.id, undefined, (r: { data: Message }) => {
				store.message.addMessage(r.data);
			});
		}
	}
}
