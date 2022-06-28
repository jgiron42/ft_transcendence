import { Store } from "vuex";
import { getModule } from "vuex-module-decorators";
import Chat from "@/store/chat";

/* eslint import/no-mutable-exports: 0 */
let chatStore: Chat;

function initialiseStores(store: Store<any>): void {
	chatStore = getModule(Chat, store);
}

export { initialiseStores, chatStore };
