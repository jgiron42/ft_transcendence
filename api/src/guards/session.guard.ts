import { SessionGuardTOTP } from "@guards/sessionTOTP.guard";
import { SessionGuardFt } from "@guards/sessionFt.guard";

/**
 * Allows access to the guarded route if the session is authenticated
 */
export const SessionGuard = [SessionGuardFt, SessionGuardTOTP];
