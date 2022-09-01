import { Plugin, Context } from "@nuxt/types";
import Vue from "vue";

class GamePlugin extends Vue {
	private ctx: Context;

	mode = "";
	spectating = false;
	id = "";
	isP1 = false;
	p1 = "";
	p2 = "";

	constructor(ctx: Context) {
		super();
		// Nuxt context allowing you to access the store, runtimeConfig and configured axios.
		// https://nuxtjs.org/docs/internals-glossary/context/
		this.ctx = ctx;
	}

	// Ensure this is called on game beforeDestroy().
	reset() {
		this.mode = "";
		this.spectating = false;
		this.id = "";
		this.isP1 = false;
		this.p1 = "";
		this.p2 = "";
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
