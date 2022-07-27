import Vue from "vue";
import { Plugin } from "@nuxt/types";
import { NuxtSocket } from "nuxt-socket-io";

interface socketHubInterface {
	getSocket(): NuxtSocket;
}

declare module "vue/types/vue" {
	interface Vue {
		$socket: socketHubInterface;
	}
}

class SocketHub extends Vue implements socketHubInterface {
	constructor(private socket: NuxtSocket) {
		super();
	}

	getSocket(): NuxtSocket {
		return this.socket;
	}
}

const SocketManager: Plugin = (context) => {
	const socket = context.app.$nuxtSocket({
		name: "chat",
		channel: "chat",
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
	Vue.prototype.$socket = hub;
};

export default SocketManager;
