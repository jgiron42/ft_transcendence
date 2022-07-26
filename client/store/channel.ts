import Vue from "vue";
import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";
import { Channel, ChannelType } from "@/models/Channel";
import { ChanConnection, ChannelRole } from "@/models/ChanConnection";
import { store } from "@/store";
import { User } from "@/models/User";
import { ChanInvitation } from "@/models/ChanInvitation";
import { DeepPartial } from "@/types/partial";

export interface IChannelStore {
	channels: Array<Channel>;
	currentChannel: ChanConnection;
	myChannels: Array<Channel>;
}

@Module({ stateFactory: true, namespaced: true, name: "channel" })
export default class ChannelStore extends VuexModule implements IChannelStore {
	public channels: Channel[] = [];
	public currentChannel: ChanConnection = new ChanConnection();
	public myChannels: Channel[] = [];

	@Mutation
	setChannels(channels: Channel[]) {
		this.channels = channels;
	}

	@Mutation
	pushFront(channels: Channel[]) {
		this.channels = channels.concat(this.channels);
	}

	@Mutation
	setMyChannels(channels: Channel[]) {
		this.myChannels = channels;
	}

	@Mutation
	pushChannel(chan: Channel) {
		const id = store.connection.chanConnections.findIndex((c: ChanConnection) => c.channel?.id === chan.id);
		const vid = this.channels.findIndex((c: Channel) => c.id === chan.id);
		if (id !== -1) {
			const _id = this.myChannels.findIndex((c: Channel) => c.id === chan.id);
			this.myChannels.splice(_id, 1, chan);
			this.channels.splice(vid, 1, chan);
		} else {
			if (vid !== -1) {
				this.channels.splice(vid, 1);
			}
			if (
				chan.type !== ChannelType.PRIVATE ||
				store.connection.chanConnections.find(
					(c: ChanConnection) => c.channel?.id === chan.id && c.user.id === store.user.me.id,
				)
			)
				this.channels.push(chan);
		}
		if (chan.id === this.currentChannel.id) {
			this.currentChannel.channel = chan;
		}
	}

	@Mutation
	pushMyChannels(channel: Channel) {
		const id = this.myChannels.findIndex((c: Channel) => c.id === channel.id);
		if (id !== -1) {
			this.myChannels.splice(id, 1, channel);
		} else {
			this.myChannels.push(channel);
		}
	}

	@Mutation
	pushMyChannelsFront(channel: Channel[]) {
		this.myChannels = channel.concat(this.myChannels);
	}

	@Mutation
	removeChannel(channel: Channel) {
		this.channels = this.channels.filter((m) => m.id !== channel.id);
	}

	@Action
	async retrieveChannels(page = 1) {
		if (page === 1) this.setChannels([]);
		await Vue.prototype.api.get("/channels", { page, per_page: 100 }, (r: { data: Channel[] }) => {
			if (r.data instanceof Array) {
				this.pushFront(r.data);
				if (r.data.length === 100) this.retrieveChannels(page + 1);
			}
		});
	}

	@Action
	async retrieveChannel(id: number) {
		await Vue.prototype.api.get(`/channels/${id}`, {}, async (r: { data: Channel }) => {
			await this.pushChannel(r.data);
		});
	}

	@Action
	async joinChannel(chan: Channel) {
		await Vue.prototype.api.post(
			`/channels/${chan.id}/join`,
			{},
			{ password: chan.password },
			async (r = { data: new ChanConnection() }) => {
				if (r.data.role === ChannelRole.BANNED) return;
				this.setCurrentConnection(r.data);
				Vue.prototype.$socket.getSocket()?.emit("JC", chan.id);
				store.connection.retrieveChanConnections();
				await store.message.setMessages([]);
				this.pushMyChannels(chan);
			},
		);
	}

	@Action
	async leaveChannel(chanId: number) {
		await Vue.prototype.api.post(`/channels/${chanId}/leave`, {}, {}, () => {
			if (chanId === this.currentChannel.channel.id) {
				this.setCurrentConnection(new ChanConnection());
			}
			this.setChannels(
				this.channels.filter((c: Channel) => !(c.id === chanId && c.type === ChannelType.PRIVATE)),
			);
			this.setMyChannels(this.myChannels.filter((c: Channel) => c.id !== chanId));
			store.connection.setChanConnections([]);
		});
	}

	@Action
	async createChannel(chan: Channel) {
		await Vue.prototype.api.post("/channels", chan, {}, (chan: Channel) => {
			this.joinChannel(chan);
		});
	}

	@Action
	async updateChannel(chan: Channel) {
		await Vue.prototype.api.put(`/channels/${chan.id}`, chan, {}, (r: { data: Channel }) => {
			if (chan.id === this.currentChannel.channel.id) {
				this.setCurrentChannel(r.data);
			}
		});
	}

	@Mutation
	setCurrentConnection(connection: ChanConnection) {
		this.currentChannel = connection;
	}

	@Mutation
	setCurrentChannel(channel: Channel) {
		this.currentChannel.channel = channel;
	}

	@Mutation
	setCurrentRole(role: ChannelRole) {
		this.currentChannel.role = role;
	}

	@Action
	async sendDm(user: User) {
		await Vue.prototype.api.get(`/users/${user.id}/dm`, undefined, async (r: { data: Channel }) => {
			await this.joinChannel(r.data);
		});
	}

	@Mutation
	async invite(invitation: DeepPartial<ChanInvitation>) {
		if (invitation.channel && invitation.user) {
			await Vue.prototype.api.post(`/channels/${invitation.channel.id}/invite/${invitation.user.id}`);
		}
	}
}
