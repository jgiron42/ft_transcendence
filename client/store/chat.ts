import { VuexModule, Module, Mutation } from "vuex-module-decorators";
import { User } from "@/models/User";
import { ChanConnection, ChannelRole } from "@/models/ChanConnection";
import { Channel } from "@/models/Channel";

export interface ChatInterface {
	me: User;
	roleOnCurrentChannel: ChannelRole;
	myChannels: Array<Channel>;
	visibleChannels: Array<Channel>;
	currentChannel: Channel;
	chanConnections: Array<ChanConnection>;
}

@Module({ stateFactory: true, namespaced: true, name: "chat" })
export default class Chat extends VuexModule implements ChatInterface {
	me: User = new User();
	roleOnCurrentChannel: ChannelRole = ChannelRole.USER;
	visibleChannels: Channel[] = [];
	myChannels: Channel[] = [];
	currentChannel: Channel = new Channel();
	chanConnections: Array<ChanConnection> = [] as ChanConnection[];

	@Mutation
	resetAll() {
		this.me = new User();
		this.visibleChannels = [];
		this.myChannels = [];
		this.currentChannel = new Channel();
		this.chanConnections = [] as ChanConnection[];
	}

	@Mutation
	updateMe(user: User) {
		this.me = user;
	}

	@Mutation
	updateMyRole(role: ChannelRole) {
		this.roleOnCurrentChannel = role;
	}

	@Mutation
	updateChanConnections(connections: ChanConnection[]) {
		this.chanConnections = connections;
	}

	@Mutation
	pushUser(connection: ChanConnection) {
		this.chanConnections.push(connection);
	}

	@Mutation
	updateCurrentChannel(chan: Channel) {
		this.currentChannel = chan;
	}

	@Mutation
	updateVisibleChannels(chans: Channel[]) {
		this.visibleChannels = chans;
	}

	@Mutation pushVisibleChannels(chan: Channel) {
		this.visibleChannels.push(chan);
	}

	@Mutation
	updateMyChannels(chans: Channel[]) {
		this.myChannels = chans;
	}

	@Mutation
	pushMyChannels(chan: Channel) {
		this.myChannels.push(chan);
	}
}
