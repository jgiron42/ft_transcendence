import { promisify } from "util";
import { ExecutionContext, Injectable } from "@nestjs/common";
import { SessionT } from "@src/types/session";
import config from "@config/api.config";
import { MemoryStore, SessionData } from "express-session";
import { User } from "@src/entities/user.entity";
import { Request } from "@src/types/request";
import * as cookieParser from "cookie-parser";
import { Container } from "typedi";
import { Socket } from "@src/types/socket";

@Injectable()
export class AuthService {
	private sessionStore: MemoryStore;
	constructor() {
		this.sessionStore = Container.get("SessionStore");
	}

	/**
	 * Call done with the TOTP key of an user
	 * @param user	user to find TOTP key of
	 * @param done	callback which will be called with the key
	 * @warning function meant to be passed to the passport-totp constructor
	 */
	static getTotpKey(this: void, user: User, done: (error: string, key: Buffer, period: number) => any): any {
		const key = {
			key: Buffer.from(user.totp_key, "hex"),
			period: 30,
		};
		return done(null, key.key, key.period);
	}

	/**
	 * Ensures a user has TOTP enabled
	 * @param_id user id
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	hasTOTP(user: User): boolean {
		void user;
		return true;
		// return user.totp_enabled;
	}

	/**
	 * Logouts a session
	 * @param session
	 */
	logout(session: SessionT) {
		// Reset 42 authentication date
		session.ftIdentified = undefined;
		// Reset TOTP validation
		session.totpIdentified = false;
	}

	/**
	 * Returns the configured session timeout
	 */
	getTimeout(): number {
		return config.sessionTimeout;
	}

	/**
	 * Ensures a session is authenticated with 42 OAuth
	 * @param ses
	 */
	isFtLogged(ses: SessionT): boolean {
		// Return true if the time since last authentication is inferior to the timeout
		return ses.ftIdentified && ses.ftIdentified + this.getTimeout() > Date.now();
	}

	/**
	 * check if a session is logged with TOTP or not
	 * @param req
	 */
	isTOTPLogged(req: Request): boolean {
		// Ensure user has TOTP enabled and is authenticated.
		return !this.hasTOTP(req.user) || req.session.totpIdentified;
	}

	/**
	 * check if a session is fully logged in or not
	 * @param req
	 */
	isLoggedIn(req: Request): boolean {
		// Ensure session is authenticated with 42 OAuth and with TOTP
		return this.isFtLogged(req.session) && this.isTOTPLogged(req);
	}

	getSession(token: string): Promise<SessionT> {
		const SID = cookieParser.signedCookie(token, config.sessionSecret);
		if (SID === false) return undefined;
		return promisify<string, SessionData>((sid: string, callback: (err: any, result: SessionData | null) => void) =>
			this.sessionStore.get(sid, callback),
		)(SID) as Promise<SessionT>;
	}

	setSession(token: string, ses: SessionT): Promise<void> {
		const SID = cookieParser.signedCookie(token, config.sessionSecret);
		if (SID === false) return undefined;
		return promisify<string, SessionData>((sid: string, session: SessionData, callback: (err: any) => void) =>
			this.sessionStore.set(sid, session, callback),
		)(SID, ses);
	}

	async wsLoadSession(context: ExecutionContext): Promise<void> {
		if (context.getType() === "ws") {
			const socket: Socket = context.switchToWs().getClient<Socket>();
			socket.token = context.switchToWs().getData<{ token: string }>()?.token ?? socket.token;
			if (socket?.token) socket.session = await this.getSession(socket.token);
			else socket.session = {} as SessionT;
		}
	}

	getSession(token: string): Promise<SessionT> {
		const SID = cookieParser.signedCookie(token, config.sessionSecret);
		if (SID === false) return undefined;
		return promisify<string, SessionData>((sid: string, callback: (err: any, result: SessionData | null) => void) =>
			this.sessionStore.get(sid, callback),
		)(SID) as Promise<SessionT>;
	}

	setSession(token: string, ses: SessionT): Promise<void> {
		const SID = cookieParser.signedCookie(token, config.sessionSecret);
		if (SID === false) return undefined;
		return promisify<string, SessionData>((sid: string, session: SessionData, callback: (err: any) => void) =>
			this.sessionStore.set(sid, session, callback),
		)(SID, ses);
	}

	async wsLoadSession(context: ExecutionContext): Promise<void> {
		if (context.getType() === "ws") {
			const socket: Socket = context.switchToWs().getClient<Socket>();
			socket.token = context.switchToWs().getData<{ token: string }>()?.token ?? socket.token;
			if (socket?.token) socket.session = await this.getSession(socket.token);
			else socket.session = {} as SessionT;
		}
	}
}
