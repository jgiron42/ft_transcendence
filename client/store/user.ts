import Vue from "vue";
import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";
import { User } from "@/models/User";

export interface IUserStore {
	me: User;
}

@Module({ stateFactory: true, namespaced: true, name: "user" })
export default class UserStore extends VuexModule implements IUserStore {
	me: User = new User();

	@Action
	async getUser() {
		await Vue.prototype.api.get(
			"/me",
			undefined,
			(r: { data: User }) => {
				this.updateMe(r.data);
			},
			() => {
				this.updateMe(new User());
			},
		);
	}

	@Mutation
	updateMe(user: User) {
		this.me = user;
	}
}
