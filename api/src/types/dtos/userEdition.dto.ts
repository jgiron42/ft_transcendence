import { IsBase64, IsBoolean, IsString, IsUrl} from "class-validator";

export class UserEdition {
	@IsString()
	pseudo: string;
	@IsUrl()
	path_avatar: string;
	@IsBoolean()
	OAuth: boolean;
	@IsBase64()
	totp_key: string;
}
