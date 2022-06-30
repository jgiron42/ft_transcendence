import { forwardRef, Module } from "@nestjs/common";
import { AuthService } from "@services/auth.service";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "@controllers/auth.controller";
import { ftStrategy } from "@strategies/auth42.strategy";
import { totpStrategy } from "@strategies/totp.strategy";
import { UserModule } from "./user.module";

@Module({
	imports: [PassportModule, forwardRef(() => UserModule)],
	providers: [AuthService, ftStrategy, totpStrategy],
	exports: [AuthService],
	controllers: [AuthController],
})
export class AuthModule {}
