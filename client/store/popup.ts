import { VuexModule, Module, Mutation } from "vuex-module-decorators";
import { User } from "@/models/User";
import { Channel } from "@/models/Channel";
import { ChanConnection } from "@/models/ChanConnection";

export interface IPopupStore {
	user: User;
	channel: Channel;
	connection: ChanConnection;
}

@Module({ stateFactory: true, namespaced: true, name: "popup" })
export default class PopupStore extends VuexModule implements IPopupStore {
	public user: User = new User();
	public channel: Channel = new Channel();
	public connection: ChanConnection = new ChanConnection();

	@Mutation
	setUser(user: User) {
		this.user = user;
	}

	@Mutation
	setChannel(channel: Channel) {
		this.channel = channel;
	}

	@Mutation
	setConnection(connection: ChanConnection) {
		this.connection = connection;
	}
}
