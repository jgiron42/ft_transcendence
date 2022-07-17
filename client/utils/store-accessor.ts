import { Store } from "vuex";
import { getModule } from "vuex-module-decorators";
import Chat from "@/store/chat";
import MessageStore from "@/store/message";
import UserProfile from "@/store/userProfile";

/* eslint import/no-mutable-exports: 0 */
export class StoreAccessor {
	chat: Chat;
	message: MessageStore;
	userProfile: UserProfile;
}

const store = new StoreAccessor();

function initialiseStores(_store: Store<any>): void {
	store.chat = getModule(Chat, _store);
	store.message = getModule(MessageStore, _store);
	store.userProfile = getModule(UserProfile, _store);
}

export { initialiseStores, store };
