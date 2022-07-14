import { VuexModule, Module, Mutation } from "vuex-module-decorators";
import { User } from "@/models/User";
import { ChanConnection, ChannelRole } from "@/models/ChanConnection";
import { Channel, ChannelType } from "@/models/Channel";
import { Message } from "@/models/Message";
import { Relation } from "@/models/Relation";
import { ChanInvitation } from "@/models/ChanInvitation";

export interface ChatInterface {
	me: User;
	roleOnCurrentChannel: ChannelRole;
	myChannels: Array<Channel>;
	visibleChannels: Array<Channel>;
	currentChannel: Channel;
	messages: Array<Message>;
	chanConnections: Array<ChanConnection>;
	chanInvitations: Array<ChanInvitation>;
	relations: Array<Relation>;
	joiningChannel: Channel | undefined;
	blockedUsers: Array<Relation>;
}

@Module({ stateFactory: true, namespaced: true, name: "chat" })
export default class Chat extends VuexModule implements ChatInterface {
	me: User = new User();
	roleOnCurrentChannel: ChannelRole = ChannelRole.USER;
	visibleChannels: Channel[] = [];
	myChannels: Channel[] = [];
	currentChannel: Channel = new Channel();
	messages: Message[] = [];
	chanConnections: Array<ChanConnection> = [] as ChanConnection[];
	chanInvitations: Array<ChanInvitation> = [] as ChanInvitation[];
	relations: Array<Relation> = [] as Relation[];
	joiningChannel: Channel | undefined = new Channel();
	blockedUsers: Relation[] = [];

	@Mutation
	resetAll() {
		this.me = new User();
		this.visibleChannels = [];
		this.myChannels = [];
		this.currentChannel = new Channel();
		this.chanConnections = [] as ChanConnection[];
	}

	@Mutation
	resetCurrentChannel() {
		this.currentChannel = new Channel();
		this.roleOnCurrentChannel = ChannelRole.USER;
	}

	@Mutation
	leaveChannel(chanId: number) {
		this.chanConnections = this.chanConnections.filter((c: ChanConnection) => c.channel.id !== chanId);
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
	updateChanConnections(connections: ChanConnection[]) {
		this.chanConnections = connections;
	}

	@Mutation
	removeChanConnection(connection: ChanConnection) {
		const id = this.chanConnections.findIndex((c: ChanConnection) => c.id === connection.id);
		if (id !== -1) this.chanConnections.splice(id, 1);
	}

	@Mutation
	pushChanConnection(connection: ChanConnection) {
		const id = this.chanConnections.findIndex((c: ChanConnection) => c.id === connection.id);
		if (id !== -1) this.chanConnections.splice(id, 1);
		this.chanConnections.push(connection);
	}

	@Mutation
	updateChanInvitations(invitations: ChanInvitation[]) {
		this.chanInvitations = invitations;
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
	updateMessages(messages: Message[]) {
		this.messages = messages;
	}

	@Mutation
	pushMessage(message: Message) {
		this.messages.push(message);
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
		const id = this.chanConnections.findIndex((c: ChanConnection) => c.channel.id === chan.id);
		const vid = this.visibleChannels.findIndex((c: Channel) => c.id === chan.id);
		if (id !== -1) {
			const _id = this.myChannels.findIndex((c: Channel) => c.id === chan.id);
			this.myChannels.splice(_id, 1);
			this.myChannels.push(chan);
			this.visibleChannels.splice(vid, 1);
			this.visibleChannels.push(chan);
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
		this.myChannels.push(chan);
	}

	@Mutation
	updateRelations(relations: Relation[]) {
		this.relations = relations;
	}

	@Mutation
	pushRelations(rel: Relation) {
		const id = this.relations.findIndex((r: Relation) => r.id === rel.id);
		if (id === -1) {
			this.relations.push(rel);
		} else {
			this.relations[id] = rel;
		}
	}

	@Mutation
	updateBlockedUsers(rel: Relation[]) {
		this.blockedUsers = rel;
	}

	@Mutation
	pushBlockedUsers(rel: Relation) {
		const id = this.blockedUsers.findIndex((r: Relation) => r.id === rel.id);
		if (id === -1) {
			this.blockedUsers.push(rel);
		} else {
			this.blockedUsers[id] = rel;
		}
	}

	@Mutation
	spliceBlockedUsers(id: number) {
		this.blockedUsers.splice(id, 1);
	}
}
