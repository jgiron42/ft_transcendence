import * as express from "express";
import { sessionUser } from "@src/types/sessionuser";
import { SessionT } from "@src/types/session";

/**
 * Express request type extended with a session attribute.
 * Type given by Nest's @Request decorator
 */
export declare type Request = express.Request & {
	user: sessionUser;
	session: SessionT;
};
