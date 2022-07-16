import { User } from "@/models/User";

export interface UserStoreInterface {
	user: User;
}

export const state = () => ({
	user: new User(),
});

export const mutations = {
	setUser(state: UserStoreInterface, user: User) {
		state.user = user;
	},
};

export const getters = {
	getUser(state: UserStoreInterface): User {
		return state.user;
	},
};
