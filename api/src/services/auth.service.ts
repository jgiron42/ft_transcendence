import { promisify } from "util";
import { ExecutionContext, Injectable } from "@nestjs/common";
import { SessionT } from "@src/types/session";
import config from "@config/api.config";
import { User } from "@src/entities/user.entity";
import { Request } from "@src/types/request";
import { MemoryStore, SessionData } from "express-session";
import * as cookieParser from "cookie-parser";
import { Container } from "typedi";
import { Socket } from "@src/types/socket";
import { UserService } from "@services/user.service";

@Injectable()
export class AuthService {
	private sessionStore: MemoryStore;
	constructor(private userService: UserService) {
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
			key: Buffer.from(user.totp_key),
			period: 30,
		};
		return done(null, key.key, key.period);
	}

	/**
	 * Ensures a user has TOTP enabled
	 * @param_id user id
	 */
	hasTOTP(ses: SessionT): boolean {
		return ses.user && ses.user.totp_enabled;
	}

	/**
	 * Logouts a session
	 * @param session
	 */
	logout(session: SessionT) {
		// Reset 42 authentication date
		session.lastAuthDateFT = undefined;
		// Reset TOTP validation
		session.isTOTPIdentified = false;
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
		return ses.lastAuthDateFT && ses.lastAuthDateFT / 1000 + this.getTimeout() > Date.now() / 1000;
	}

	/**
	 * check if a session is logged with TOTP or not
	 */
	isTOTPLogged(session: SessionT): boolean {
		// Ensure user has TOTP enabled and is authenticated.
		return !this.hasTOTP(session) || session.isTOTPIdentified;
	}

	/**
	 * check if a session is fully logged in or not
	 * @param req
	 */
	isLoggedIn(req: Request): boolean {
		// Ensure session is authenticated with 42 OAuth and with TOTP
		return this.isFtLogged(req.session) && this.isTOTPLogged(req.session);
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

	async updateOrCreateSessionUser(session: SessionT) {
		session.user = await this.userService.findOne(session.sessionUser.id);
		if (!session.user) {
			session.user = await this.userService.create({
				id: session.sessionUser.id,
				username: session.sessionUser.firstName ?? session.sessionUser.id,
			});
		}
	}
}
