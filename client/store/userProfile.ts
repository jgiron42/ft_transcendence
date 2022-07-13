import { VuexModule, Module, Mutation } from "vuex-module-decorators";
import { User } from "@/models/User";

export interface UserProfileInterface {
	user: User;
}

@Module({ stateFactory: true, namespaced: true, name: "userProfile" })
export default class userProfile extends VuexModule implements UserProfileInterface {
	public user: User = new User();

	@Mutation
	updateUser(user: User) {
		this.user = user;
	}
}
