import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "@src/controllers/app.controller";
import { User } from "@entities/user.entity";
import { Channel } from "@entities/channel.entity";
import { ChanInvitation } from "@entities/chan_invitation.entity";
import { ChanInvitationService } from "@services/chan_invitation.service";
import { UserModule } from "@modules/user.module";
import { AuthModule } from "./auth.module";

@Module({
	imports: [TypeOrmModule.forFeature([ChanInvitation, User, Channel]), AuthModule, forwardRef(() => UserModule)],
	providers: [ChanInvitationService],
	controllers: [AppController],
	exports: [ChanInvitationService],
})
export class ChanInvitationModule {}
