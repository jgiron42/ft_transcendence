import { VuexModule, Module, Mutation } from "vuex-module-decorators";
import { User } from "@/models/User";

export interface PopupProfileInterface {
	user: User;
}

@Module({ stateFactory: true, namespaced: true, name: "popupUser" })
export default class popupUser extends VuexModule implements PopupProfileInterface {
	public user: User = new User();

	@Mutation
	setUser(user: User) {
		this.user = user;
	}
}
