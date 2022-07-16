import { User } from "@/models/User";

// Centralized user

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
