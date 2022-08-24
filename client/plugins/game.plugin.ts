import { Plugin, Context } from "@nuxt/types";
import Vue from "vue";

class GamePlugin extends Vue {
	private ctx: Context;

	mode = "";
	spectating = false;
	id = "";

	constructor(ctx: Context) {
		super();
		// Nuxt context allowing you to access the store, runtimeConfig and configured axios.
		// https://nuxtjs.org/docs/internals-glossary/context/
		this.ctx = ctx;
	}
}

declare module "vue/types/vue" {
	interface Vue {
		$game: GamePlugin;
	}
}

const GameWrapper: Plugin = (context) => {
	Vue.prototype.$game = new GamePlugin(context);
};

export default GameWrapper;
