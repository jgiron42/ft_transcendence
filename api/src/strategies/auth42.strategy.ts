import { Strategy } from "passport-42";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { SessionUser } from "@src/types/sessionuser";
import { ftProfile } from "@src/types/42Profile";
import intraConfig from "@config/intra.config";
import config from "@config/api.config";

/**
 * Passport strategy for 42 OAuth
 */
@Injectable()
export class ftStrategy extends PassportStrategy(Strategy) {
	constructor() {
		// Set OAuth app credentials
		super({
			clientID: intraConfig.uid,
			clientSecret: intraConfig.secret,
			callbackURL: `${config.baseUrl}auth/42`,
		});
	}

	validate(
		accessToken: string,
		refreshToken: string,
		profile: ftProfile,
		done: (error: string, user: SessionUser) => any,
	): any {
		console.log(profile);
		const user: SessionUser = {
			accessToken,
			refreshToken,
			id: profile.username,
			firstName: profile._json.usual_first_name ?? profile.name.givenName,
			lastName: profile.name.familyName,
		};
		return done(null, user);
	}
}
