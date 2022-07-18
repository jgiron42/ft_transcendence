import { Store } from "vuex";
import { getModule } from "vuex-module-decorators";
import MessageStore from "@/store/message";
import PopupStore from "@/store/popup";
import RelationStore from "@/store/relation";
import InvitationStore from "@/store/invitation";
import ConnectionStore from "@/store/connection";
import ChannelStore from "@/store/channel";
import UserStore from "@/store/user";

export class StoreAccessor {
	message: MessageStore;
	relation: RelationStore;
	popup: PopupStore;
	invitation: InvitationStore;
	connection: ConnectionStore;
	channel: ChannelStore;
	user: UserStore;
}

const store = new StoreAccessor();

function initialiseStores(_store: Store<any>): void {
	store.message = getModule(MessageStore, _store);
	store.popup = getModule(PopupStore, _store);
	store.relation = getModule(RelationStore, _store);
	store.invitation = getModule(InvitationStore, _store);
	store.connection = getModule(ConnectionStore, _store);
	store.channel = getModule(ChannelStore, _store);
	store.user = getModule(UserStore, _store);
}

export { initialiseStores, store };
