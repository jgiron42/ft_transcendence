import { Context } from "@nuxt/types";
import { cloneDeep } from "lodash-es";

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
		this.ctx = ctx;
	}

	private ctx: Context;

	private get user(): User {
		return cloneDeep(this.ctx.store.getters.getUser);
	}

	async fetch(): Promise<User> {
		try {
			const response = await this.ctx.$axios.get(this.ctx.$config.ft_api.url + "/me");

			if (response.data.id) {
				this.ctx.store.commit("setUser", response.data);
				return response.data;
			}
			return this.user;
		} catch (err: any) {
			if (err.response && err.response.data.authMethod) {
				if (err.response.data.authMethod === "42") {
					const user = this.user;
					console.log(err.response);
					user.id = err.response.data.id;
					if (user.id) user.totp_enabled = false;
					this.setUser(user);
					return this.user;
				}
				if (err.response.data.authMethod === "TOTP") {
					this.ctx.redirect("/totp_authenticate");
				}
			}
			throw err;
		}
	}

	async getUser(): Promise<User> {
		const storedUser = this.user;
		if (storedUser.id === null) return await this.fetch();
		return this.user;
	}

	async save() {
		const user = this.user;
		await this.ctx.$axios.$put(`/users/${user.id}`, user);
	}

	setUser(user: User) {
		this.ctx.store.commit("setUser", user);
	}
}
