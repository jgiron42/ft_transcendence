import * as express from "express";
import { SessionT } from "@src/types/session";

/**
 * Express request type extended with a session attribute.
 * Type given by Nest's @Request decorator
 */
export declare type Request<T = any> = express.Request & {
	session: SessionT;
	value: T;
	groups: string[];
};
