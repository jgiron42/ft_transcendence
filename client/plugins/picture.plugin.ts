import type { NuxtApp } from "@nuxt/types/app";
import Vue from "vue";

function getSrc(this: NuxtApp, id: string) {
	return `${this.$config.ft_api.url}/users/${id}/picture`;
}

declare module "vue/types/vue" {
	interface Vue {
		$getPictureSrc: typeof getSrc;
	}
}

Vue.prototype.$getPictureSrc = getSrc;
