import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserService } from "@services/user.service";
import { User } from "@entities/user.entity";
import { Channel } from "@entities/channel.entity";
import { ChannelService } from "@services/channel.service";
import { ChanConnectionModule } from "@modules/chan_connection.module";
import { ChanConnection } from "@entities/chan_connection.entity";
import { SocketService } from "@services/socket.service";
import { ChannelsController } from "@controllers/channels.controller";
import { MessageModule } from "@modules/message.module";
import { ChanInvitationModule } from "@modules/chan_invitation.module";
import { UserModule } from "./user.module";
import { AuthModule } from "./auth.module";

@Module({
	imports: [
		TypeOrmModule.forFeature([ChanConnection, Channel, User]),
		forwardRef(() => AuthModule),
		ChanConnectionModule,
		forwardRef(() => UserModule),
		forwardRef(() => ChanInvitationModule),
		MessageModule,
	],
	providers: [ChannelService, UserService, SocketService],
	controllers: [ChannelsController],
	exports: [ChannelService, UserService],
})
export class ChannelModule {}
