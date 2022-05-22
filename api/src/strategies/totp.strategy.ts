import { Strategy } from "passport-totp";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { AuthService } from "@services/auth.service";

/**
 * Passport strategy for TOTP
 */
@Injectable()
export class totpStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({ window: 10 }, AuthService.getTotpKey);
	}
}
