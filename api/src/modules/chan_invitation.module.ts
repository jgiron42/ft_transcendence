import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "@src/controllers/app.controller";
import { UserService } from "@services/user.service";
import { User } from "@entities/user.entity";
import { Channel } from "@entities/channel.entity";
import { ChannelService } from "@services/channel.service";
import { MessageService } from "@services/message.service";
import { Message } from "@entities/message.entity";
import { ChanInvitation } from "@entities/chan_invitation.entity";
import { ChanInvitationService } from "@services/chan_invitation.service";
import { AuthModule } from "./auth.module";

@Module({
	imports: [TypeOrmModule.forFeature([ChanInvitation, User, Channel, Message]), AuthModule],
	providers: [ChanInvitationService, UserService, ChannelService, MessageService],
	controllers: [AppController],
	exports: [ChanInvitationService, UserService, ChannelService, MessageService],
})
export class ChanInvitationModule {}
