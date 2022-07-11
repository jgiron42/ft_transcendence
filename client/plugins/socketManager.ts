import Vue from "vue";
import { Plugin } from "@nuxt/types";
import { NuxtSocket } from "nuxt-socket-io";

interface socketHubInterface {
	getSocket(): NuxtSocket;
}

declare module "vue/types/vue" {
	// this.$myInjectedFunction inside Vue components
	interface Vue {
		$socketManager: socketHubInterface;
	}
}

class SocketHub extends Vue implements socketHubInterface {
	constructor(private socket: NuxtSocket) {
		super();
	}

	getSocket(): NuxtSocket {
		this.$nuxt.$emit("getSocket");
		return this.socket;
	}
}

const SocketManager: Plugin = (context, inject) => {
	const socket = context.app.$nuxtSocket({
		name: "chat",
		channel: "/chat",
		reconnection: true,
		reconnectionAttempts: Infinity,
		reconnectionDelay: 1000,
		reconnectionDelayMax: 5000,
		timeout: 10000,
		autoConnect: true,
		transports: ["websocket"],
		teardown: false,
	});
	const hub = new SocketHub(socket);
	inject("socketManager", hub);
}

export default SocketManager;
