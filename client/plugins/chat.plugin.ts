import Vue from "vue";
import { store } from "@/store";
import { User } from "@/models/User";

interface IChatPlugin {
	whoAmI(): Promise<User | undefined>;
}

class ChatPlugin extends Vue implements IChatPlugin {
	async whoAmI(): Promise<User | undefined> {
		let ret;
		await this.api.get("/me", undefined, (r: { data: User }) => {
			store.chat.updateMe(r.data);
			ret = store.chat.me;
		});
		return ret;
	}
}

declare module "vue/types/vue" {
	interface Vue {
		chat: ChatPlugin;
	}
}

Vue.prototype.chat = new ChatPlugin();
