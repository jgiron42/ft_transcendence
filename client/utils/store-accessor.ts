import { Store } from "vuex";
import { getModule } from "vuex-module-decorators";
import Chat from "@/store/chat";
import MessageStore from "@/store/message";
import PopupUser from "@/store/popupUser";
import RelationStore from "@/store/relation";
import InvitationStore from "@/store/invitation";

export class StoreAccessor {
	chat: Chat;
	message: MessageStore;
	relation: RelationStore;
	popupUser: PopupUser;
	invitation: InvitationStore;
}

const store = new StoreAccessor();

function initialiseStores(_store: Store<any>): void {
	store.chat = getModule(Chat, _store);
	store.message = getModule(MessageStore, _store);
	store.popupUser = getModule(PopupUser, _store);
	store.relation = getModule(RelationStore, _store);
	store.invitation = getModule(InvitationStore, _store);
}

export { initialiseStores, store };
