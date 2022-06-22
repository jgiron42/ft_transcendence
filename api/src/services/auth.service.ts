import { promisify } from "util";
import { ExecutionContext, Injectable } from "@nestjs/common";
import { sessionUser } from "@src/types/sessionuser";
import { SessionT } from "@src/types/session";
import config from "@config/api.config";
import { MemoryStore, SessionData } from "express-session";
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
	 * @param _user	user to find TOTP key of
	 * @param done	callback which will be called with the key
	 * @warning function meant to be passed to the passport-totp constructor
	 */
	static getTotpKey(this: void, _user: sessionUser, done: (error: string, key: Buffer, period: number) => any): any {
		// TODO: find in DB
		const key = {
			key: Buffer.from([
				0xc3, 0x6c, 0x25, 0x98, 0xd0, 0x67, 0xd5, 0x65, 0x16, 0xc8, 0x46, 0xa6, 0x78, 0x3a, 0x22, 0x28, 0x24,
				0x82, 0xb8, 0xd2,
			]), // https://totp.danhersam.com/?key=ynwclggqm7kwkfwii2thqorcfasifogs
			period: 30,
		};
		return done(null, key.key, key.period);
	}

	/**
	 * Ensures a user has TOTP enabled
	 * @param_id user id
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	hasTOTP(_id: string): boolean {
		// TODO: find in DB
		return true;
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
	 * @param ses
	 */
	isTOTPLogged(ses: SessionT): boolean {
		// Ensure user has TOTP enabled and is authenticated.
		return !this.hasTOTP(ses.user.id) || ses.totpIdentified;
	}

	/**
	 * check if a session is fully logged in or not
	 * @param ses
	 */
	isLoggedIn(ses: SessionT): boolean {
		// Ensure session is authenticated with 42 OAuth and with TOTP
		return this.isFtLogged(ses) && this.isTOTPLogged(ses);
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
