import Vue from "vue";
import { chatStore } from "@/store";
import { User } from "@/models/User";
import ChannelPlugin from "@/plugins/channel.plugin";
import ChanConnectionPlugin from "@/plugins/chan_connection.plugin";
import ChanInvitationPlugin from "@/plugins/chan_invitation.plugin";
import MessagePlugin from "@/plugins/message.plugin";
import RelationPlugin from "@/plugins/relation.plugin";

interface IChatPlugin {
	channel: ChannelPlugin;
	chanConnection: ChanConnectionPlugin;
	chanInvitation: ChanInvitationPlugin;
	message: MessagePlugin;
	relation: RelationPlugin;
	whoAmI(): Promise<User | undefined>;
}

class ChatPlugin extends Vue implements IChatPlugin {
	channel: ChannelPlugin = new ChannelPlugin();
	chanConnection: ChanConnectionPlugin = new ChanConnectionPlugin();
	chanInvitation: ChanInvitationPlugin = new ChanInvitationPlugin();
	message: MessagePlugin = new MessagePlugin();
	relation: RelationPlugin = new RelationPlugin();

	async whoAmI(): Promise<User | undefined> {
		let ret;
		await this.api.get("/me", undefined, (r: { data: User }) => {
			chatStore.updateMe(r.data);
			ret = chatStore.me;
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
