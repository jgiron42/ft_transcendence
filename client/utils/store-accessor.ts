import { Store } from "vuex";
import { getModule } from "vuex-module-decorators";
import Chat from "@/store/chat";
import UserProfile from "@/store/userProfile";

/* eslint import/no-mutable-exports: 0 */
let chatStore: Chat;
let userProfile: UserProfile;

function initialiseStores(store: Store<any>): void {
	chatStore = getModule(Chat, store);
	userProfile = getModule(UserProfile, store);
}

export { initialiseStores, chatStore, userProfile };
