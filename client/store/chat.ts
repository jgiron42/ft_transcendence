import { VuexModule, Module, Mutation } from "vuex-module-decorators";
import { User } from "@/models/User";
import { ChanConnection, ChannelRole } from "@/models/ChanConnection";
import { Channel, ChannelType } from "@/models/Channel";
import { store } from "@/store";

export interface ChatInterface {
	me: User;
	roleOnCurrentChannel: ChannelRole;
	myChannels: Array<Channel>;
	visibleChannels: Array<Channel>;
	currentChannel: Channel;
	joiningChannel: Channel | undefined;
}

@Module({ stateFactory: true, namespaced: true, name: "chat" })
export default class Chat extends VuexModule implements ChatInterface {
	me: User = new User();
	roleOnCurrentChannel: ChannelRole = ChannelRole.USER;
	visibleChannels: Channel[] = [];
	myChannels: Channel[] = [];
	currentChannel: Channel = new Channel();
	joiningChannel: Channel | undefined = new Channel();
	mutePopup: ChanConnection = new ChanConnection();

	@Mutation
	updateMutePopup(connection: ChanConnection) {
		this.mutePopup = connection;
	}

	@Mutation
	resetCurrentChannel() {
		this.currentChannel = new Channel();
		this.roleOnCurrentChannel = ChannelRole.USER;
	}

	@Mutation
	leaveChannel(chanId: number) {
		this.visibleChannels = this.visibleChannels.filter(
			(c: Channel) => !(c.id === chanId && c.type === ChannelType.PRIVATE),
		);
		this.myChannels = this.myChannels.filter((c: Channel) => c.id !== chanId);
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
	updateCurrentChannel(chan: Channel) {
		this.currentChannel = chan;
	}

	@Mutation
	updateJoiningChannel(chan: Channel) {
		this.joiningChannel = chan;
	}

	@Mutation
	removeJoiningChannel() {
		this.joiningChannel = undefined;
	}

	@Mutation
	updateVisibleChannels(chans: Channel[]) {
		this.visibleChannels = chans;
	}

	@Mutation
	pushVisibleChannels(chan: Channel) {
		this.visibleChannels.push(chan);
	}

	@Mutation
	updateChannel(chan: Channel) {
		const id = store.connection.chanConnections.findIndex((c: ChanConnection) => c.channel.id === chan.id);
		const vid = this.visibleChannels.findIndex((c: Channel) => c.id === chan.id);
		if (id !== -1) {
			const _id = this.myChannels.findIndex((c: Channel) => c.id === chan.id);
			this.myChannels.splice(_id, 1, chan);
			this.visibleChannels.splice(vid, 1, chan);
		} else {
			if (vid !== -1) {
				this.visibleChannels.splice(vid, 1);
			}
			if (chan.type !== ChannelType.PRIVATE) {
				this.visibleChannels.push(chan);
			}
		}
		if (chan.id === this.currentChannel.id) {
			this.currentChannel = chan;
		}
	}

	@Mutation
	updateMyChannels(chans: Channel[]) {
		this.myChannels = chans;
	}

	@Mutation
	pushMyChannels(chan: Channel) {
		const id = this.myChannels.findIndex((c: Channel) => c.id === chan.id);
		if (id !== -1) {
			this.myChannels.splice(id, 1);
		}
		this.myChannels.push(chan);
	}
}
