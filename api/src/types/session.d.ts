import { SessionUser } from "@src/types/sessionuser";
import { SessionData } from "express-session";
import { User } from "@entities/user.entity";

export declare type SessionT = SessionData & {
	sessionUser: SessionUser;
	user: User;
	ftIdentified: number; // The date of last authentication with 42 or undefined if the user is not authenticated
	totpIdentified: boolean; // Flags session as authenticated with TOTP
};
