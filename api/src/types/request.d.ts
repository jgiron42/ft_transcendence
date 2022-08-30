import type * as express from "express";
import type { SessionT } from "@src/types/session";
import type { User } from "@entities/user.entity";

/**
 * Express request type extended with a session attribute.
 * Type given by Nest's @Request decorator
 */
export declare type Request<T = any> = express.Request & {
	user: User;
	session: SessionT;
	value: T;
	groups: string[];
};
