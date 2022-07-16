import { sessionUser } from "@src/types/sessionuser";

export declare type SessionT = {
	user: sessionUser;
	lastAuthDateFT: number; // The date of last authentication with 42 or undefined if the user is not authenticated
	isTOTPIdentified: boolean; // Flags session as authenticated with TOTP
};
