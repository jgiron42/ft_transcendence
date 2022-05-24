import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "@src/controllers/app.controller";
import { UserService } from "@services/user.service";
import { User } from "@entities/user.entity";
import { Channel } from "@entities/channel.entity";
import { ChannelService } from "@services/channel.service";
import { ChanInvitation } from "@entities/chan_invitation.entity";
import { ChanInvitationService } from "@services/chan_invitation.service";

@Module({
	imports: [TypeOrmModule.forFeature([ChanInvitation, User, Channel])],
	providers: [ChanInvitationService, UserService, ChannelService],
	controllers: [AppController],
	exports: [ChanInvitationService, UserService, ChannelService],
})
export class ChanInvitationModule {}
