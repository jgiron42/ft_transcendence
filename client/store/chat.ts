import { VuexModule, Module, Mutation } from "vuex-module-decorators";
import { User } from "@/models/User";
import { ChanConnection } from "@/models/ChanConnection";
import { Channel } from "@/models/Channel";

export interface ChatInterface {
	me: User;
	joiningChannel: Channel | undefined;
}

@Module({ stateFactory: true, namespaced: true, name: "chat" })
export default class Chat extends VuexModule implements ChatInterface {
	me: User = new User();
	joiningChannel: Channel | undefined = new Channel();
	mutePopup: ChanConnection = new ChanConnection();

	@Mutation
	updateMutePopup(connection: ChanConnection) {
		this.mutePopup = connection;
	}

	@Mutation
	updateMe(user: User) {
		this.me = user;
	}

	@Mutation
	updateJoiningChannel(chan: Channel) {
		this.joiningChannel = chan;
	}

	@Mutation
	removeJoiningChannel() {
		this.joiningChannel = undefined;
	}
}
