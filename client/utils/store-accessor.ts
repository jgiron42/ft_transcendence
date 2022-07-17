import { Store } from "vuex";
import { getModule } from "vuex-module-decorators";
import Chat from "@/store/chat";
import MessageStore from "@/store/message";
import PopupUser from "@/store/popupUser";
import RelationStore from "@/store/relation";
import InvitationStore from "@/store/invitation";
import ConnectionStore from "@/store/connection";

export class StoreAccessor {
	chat: Chat;
	message: MessageStore;
	relation: RelationStore;
	popupUser: PopupUser;
	invitation: InvitationStore;
	connection: ConnectionStore;
}

const store = new StoreAccessor();

function initialiseStores(_store: Store<any>): void {
	store.chat = getModule(Chat, _store);
	store.message = getModule(MessageStore, _store);
	store.popupUser = getModule(PopupUser, _store);
	store.relation = getModule(RelationStore, _store);
	store.invitation = getModule(InvitationStore, _store);
	store.connection = getModule(ConnectionStore, _store);
}

export { initialiseStores, store };
