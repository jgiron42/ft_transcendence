import { Context } from "@nuxt/types";

// User type declaration identical to API's one.
export class User {
	constructor() {
		this.id = null;
		this.username = "";
		this.image_url = "";
		this.nb_game = 0;
		this.nb_win = 0;
		this.totp_enabled = false;
		this.totp_key = "";
		this.status = 0;
		this.created_at = new Date();
	}

	id: number | string | null;
	username: string;
	image_url: string;
	nb_game: number;
	nb_win: number;
	totp_enabled: boolean;
	status: number;
	totp_key: string;
	created_at: Date;
}

// Wrapper of UserStore allowing to automatically fetch, store, save and return the user when needed.
export class UserSingleton {
	constructor(ctx: Context) {
		// Nuxt context allowing you to access the store, runtimeConfig and configured axios.
		// https://nuxtjs.org/docs/internals-glossary/context/
		this.ctx = ctx;
	}

	private ctx: Context;

	private get user(): User {
		// Clone stored user.
		return { ...this.ctx.store.getters.getUser };
	}

	async fetch(): Promise<User> {
		try {
			// Get user from API.
			const response = await this.ctx.$axios.get(this.ctx.$config.ft_api.url + "/me");

			// Ensure returner user is valid.
			if (response.data.id) {
				// Store fetched user.
				this.ctx.store.commit("setUser", response.data);

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
					this.ctx.redirect("/totp_authenticate");
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
		if (storedUser.id === null) return await this.fetch();

		// Return stored user
		return this.user;
	}

	async save() {
		// Get stored user
		const user = this.user;

		// Save stored user in database.
		await this.ctx.$axios.$put(`/users/${user.id}`, user);
	}

	setUser(user: User) {
		// Replace stored user with parameter
		this.ctx.store.commit("setUser", user);
	}
}
