import * as io from "socket.io";
import { DefaultEventsMap, EventsMap } from "socket.io/dist/typed-events";
import { SessionT } from "@src/types/session";

export interface Socket<
	ListenEvents extends EventsMap = DefaultEventsMap,
	EmitEvents extends EventsMap = ListenEvents,
	ServerSideEvents extends EventsMap = DefaultEventsMap,
	SocketData = any,
> extends io.Socket<EmitEvents, ServerSideEvents, SocketData, SocketData> {
	token: string;
	session: SessionT;
}
