import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";
import { User } from "@/models/User";
import { Channel } from "@/models/Channel";

export interface ChatInterface {
	me: User;
	channels: Array<Channel>;
	currentChannel: Channel;
}

@Module({ stateFactory: true, namespaced: true, name: "chat" })
export default class Chat extends VuexModule implements ChatInterface {
	me: User = new User();
	channels: Channel[] = [];
	currentChannel: Channel = new Channel();

	@Mutation
	updateMe(user: User) {
		this.me = user;
	}

	@Mutation
	updateCurrentChannel(chan: Channel) {
		this.currentChannel = chan;
	}

	@Mutation
	updateChannels(chans: Channel[]) {
		this.channels = chans;
	}

	@Action
	getMe(): User {
		return this.me;
	}
}
