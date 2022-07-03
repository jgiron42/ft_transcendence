import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "@entities/user.entity";
import { Channel } from "@entities/channel.entity";
import { ChanInvitation } from "@entities/chan_invitation.entity";
import { ChanInvitationService } from "@services/chan_invitation.service";
import { UserModule } from "@modules/user.module";
import { InvitationsController } from "@controllers/invitations.controller";
import { ChanConnectionModule } from "@modules/chan_connection.module";
import { AuthModule } from "./auth.module";

@Module({
	imports: [
		TypeOrmModule.forFeature([ChanInvitation, User, Channel]),
		forwardRef(() => AuthModule),
		forwardRef(() => UserModule),
		forwardRef(() => ChanConnectionModule),
	],
	providers: [ChanInvitationService],
	controllers: [InvitationsController],
	exports: [ChanInvitationService],
})
export class ChanInvitationModule {}
