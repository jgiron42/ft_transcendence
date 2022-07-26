import { NuxtSocket } from "nuxt-socket-io";

export default interface SocketHubInterface {
	getSocket(): NuxtSocket;
	on(event: string, listener: (...args: any[]) => void): NuxtSocket;
	getMatchingEvents(prefix: string): string[];
	emit(event: string, ...args: any[]): NuxtSocket;
	clearMatchingEvents(prefix: string): number;
}
