import { Plugin, Context } from "@nuxt/types";
import Vue from "vue";
import _ from "lodash";
import { User } from "@/models/User";
import { store } from "@/store";
import { initialiseStores } from "@/utils/store-accessor";

class UserSingleton extends Vue {
	constructor(ctx: Context) {
		super();
		// Nuxt context allowing you to access the store, runtimeConfig and configured axios.
		// https://nuxtjs.org/docs/internals-glossary/context/
		this.ctx = ctx;
		this.fetch().catch((_) => {});
		initialiseStores(this.ctx.store);
	}

	private ctx: Context;

	private get user(): User {
		// Clone stored user.
		return _.cloneDeep(store.user.me);
	}

	async fetch(): Promise<User> {
		try {
			// Get user from API.
			const response = await this.ctx.$axios.get("/me");

			// Ensure returner user is valid.
			if (response.data.id) {
				// Store fetched user.
				this.setUser(response.data);

				// Prompt user to fill his infos
				if (this.$user.user.initialized === false) this.ctx.redirect("/welcome");

				// Return fetched user.
				return response.data;
			}

			// Return stored user in case of bad response.
			return this.user;
		} catch (err: any) {
			// Handle missing auth.
			if (err.response && err.response.data.authMethod) {
				// Only set user id when 42 auth is missing.
				if (err.response.data.authMethod === "42") {
					const user = this.user;
					user.id = err.response.data.id;
					if (user.id) user.totp_enabled = false;
					this.setUser(user);
					return this.user;
				}
				// Handle missing TOTP auth.
				if (err.response.data.authMethod === "TOTP") {
					// Redirect to 2FA component.
					this.ctx.redirect("/totp");
				}
			}

			// Throw caught error again
			throw err;
		}
	}

	async getUser(): Promise<User> {
		// Get stored user
		const storedUser = this.user;

		// Ensure stored user is valid, else fetch and return one from API
		if (!storedUser.id) return await this.fetch();

		// Return stored user
		return this.user;
	}

	async save() {
		// Save stored user in database.
		return await this.ctx.$axios.$put(`/users/${this.user.id}`, this.user);
	}

	setUser(user: User) {
		// Replace stored user with parameter
		store.user.setUser(_.cloneDeep(user));
	}
}

declare module "vue/types/vue" {
	interface Vue {
		$user: UserSingleton;
	}
}

const UserWrapper: Plugin = (context) => {
	Vue.prototype.$user = new UserSingleton(context);
};

export default UserWrapper;
