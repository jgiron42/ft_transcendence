import Vue from "vue";
import { Channel } from "@/models/Channel";
import { User } from "@/models/User";

interface chatInterface {
	me: User;
	channels: Array<Channel>;
	currentChannel: Channel;
	usersInChannel: Array<User>;
}

declare module "vue/types/vue" {
	interface Vue {
		chat: chatInterface;
	}
}

Vue.prototype.chat = <chatInterface>{
	me: new User(),
	channels: [] as Channel[],
	currentChannel: new Channel(),
	usersInChannel: [] as User[],
};
