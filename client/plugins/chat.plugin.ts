import Vue from "vue";
import { store } from "@/store";
import { User } from "@/models/User";
import { ChannelPlugin } from "@/plugins/channel.plugin";
import { ChanConnectionPlugin } from "@/plugins/chan_connection.plugin";

interface IChatPlugin {
	channel: ChannelPlugin;
	chanConnection: ChanConnectionPlugin;
	whoAmI(): Promise<User | undefined>;
}

class ChatPlugin extends Vue implements IChatPlugin {
	channel: ChannelPlugin = new ChannelPlugin();
	chanConnection: ChanConnectionPlugin = new ChanConnectionPlugin();

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
