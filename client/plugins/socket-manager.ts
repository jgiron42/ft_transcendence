import Vue from "vue";
import { Plugin, Context } from "@nuxt/types";
import { NuxtSocket } from "nuxt-socket-io";
import SocketHubInterface from "~/types/socker-hub";

declare module "vue/types/vue" {
	interface Vue {
		$gameSocket: SocketHubInterface;
		$chatSocket: SocketHubInterface;
	}
}

class SocketHub extends Vue implements SocketHubInterface {
	constructor(private socket: NuxtSocket) {
		super();
		this.events = new Set<string>();
	}

	// Registered events
	events: Set<string>;

	// Get internal socket
	getSocket(): NuxtSocket {
		return this.socket;
	}

	// Wrapper of socket.on storing the event so it can be found and removed later
	on(event: string, listener: (...args: any[]) => void): NuxtSocket {
		// Register event
		this.events.add(event);

		// Actually listen to the event
		return this.socket.on(event, listener);
	}

	// Wrapper of emit to allow SocketHub to be used as a regular socket
	emit(event: string, ...args: any[]): NuxtSocket {
		return this.socket.emit(event, ...args);
	}

	// Get all events prefixed by argument ("<prefix>:<event>")
	getMatchingEvents(prefix: string): string[] {
		const reg = new RegExp(`^${prefix}:.*$`);
		return [...this.events].filter((event: string) => reg.test(event));
	}

	// Unregister and stop listening to matching events
	// Returns the number of cleared events
	clearMatchingEvents(prefix: string): number {
		const reg = new RegExp(`^${prefix}:.*$`);
		let count: number = 0;
		this.events.forEach((event: string) => {
			if (reg.test(event)) {
				this.socket.removeAllListeners(event);
				this.events.delete(event);
				count++;
			}
		});
		return count;
	}
}

function initSocket(name: string, context: Context): SocketHubInterface {
	const socket = context.app.$nuxtSocket({
		name,
		channel: name,
		reconnection: true,
		reconnectionAttempts: Infinity,
		reconnectionDelay: 1000,
		reconnectionDelayMax: 5000,
		timeout: 10000,
		autoConnect: true,
		transports: ["websocket"],
		teardown: false,
		forceNew: true,
	});

	socket.on("connect", () => {
		console.log("[WEBSOCKET]: connected", socket.id);
	});

	// Send session cookie to server in order to authenticate
	socket.emit("authenticate", { token: context.app.$cookies.get("connect.sid") });

	// Handle received websocket errors
	socket.on("exception", (err: { authMethod: null | "42" | "totp" } | null) => {
		console.log("[WEBSOCKET]: ERROR:", JSON.stringify(err));

		// Authenticate when server throws an authentication error
		if (err && err.authMethod) {
			switch (err.authMethod) {
				case "42":
					// Authenticate with 42 OAuth
					window.location.href = `${context.app.$config.ft_api.url}/auth/42`;
					return;
				case "totp":
					// Redirect to TOTP page
					context.app.$router.push("/totp_authenticate");
					return;
			}
		}

		// Display un-handled error
		window.$nuxt.$emit("addAlert", { title: "WEBSOCKET ERROR", message: JSON.stringify(err) });
	});

	socket.on("connect_error", (err: any) => {
		console.log("[WEBSOCKET]: ERROR:", JSON.stringify(err));
		window.$nuxt.$emit("addAlert", { title: "WEBSOCKET ERROR", message: err.toString() });
	});

	// Log all event
	socket.onAny((event: any, ...args: any) => {
		console.log("[WEBSOCKET][WS ANY]:", event, args);
	});

	return new SocketHub(socket);
}

const SocketManager: Plugin = (context) => {
	// Inject socket hub in Nuxt instance
	Vue.prototype.$gameSocket = initSocket("game", context);
	Vue.prototype.$chatSocket = initSocket("chat", context);
};

export default SocketManager;
