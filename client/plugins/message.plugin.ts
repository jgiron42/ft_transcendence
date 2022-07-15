import Vue from "vue";
import { chatStore } from "@/store";
import { Message } from "@/models/Message";
import { Relation } from "@/models/Relation";

export class MessagePlugin extends Vue {
	async getMessage(message: Message): Promise<void> {
		// check if message.user isn't blocked
		if (!chatStore.blockedUsers.find((r: Relation) => r.target.id === message.user)) {
			await this.api.get("/messages/" + message.id, undefined, (r: { data: Message }) => {
				chatStore.pushMessage(r.data);
			});
		}
	}
}
