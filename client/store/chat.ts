import { VuexModule, Module, Mutation } from "vuex-module-decorators";
import { User } from "@/models/User";
import { ChanConnection, ChannelRole } from "@/models/ChanConnection";
import { Channel } from "@/models/Channel";
import { Relation } from "@/models/Relation";
import { ChanInvitation } from "@/models/ChanInvitation";

export interface ChatInterface {
	me: User;
	roleOnCurrentChannel: ChannelRole;
	myChannels: Array<Channel>;
	visibleChannels: Array<Channel>;
	currentChannel: Channel;
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
