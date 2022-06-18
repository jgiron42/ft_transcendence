import Vue from "vue";

declare module "vue/types/vue" {
	interface Vue {
		$myInjectedFunction(): void;
	}
}

Vue.prototype.$myInjectedFunction = () => console.log("lol2");
