import { Module } from "@nestjs/common";
import { ChatGateway } from "@gateways/chat.gateway";
import { MessageModule } from "@modules/message.module";
import { UserModule } from "@modules/user.module";
import { AuthModule } from "@modules/auth.module";
import { ChannelModule } from "@modules/channel.module";
import { ChanConnectionModule } from "@modules/chan_connection.module";
import { SocketService } from "@services/socket.service";
import { RelationSubscriber } from "@subscribers/relation.subscriber";
import { ChannelSubscriber } from "@subscribers/channel.subscriber";
import { ChanConnectionSubscriber } from "@subscribers/chan_connection.subscriber";
import { MessageSubscriber } from "@subscribers/message.subscriber";
import { ChanInvitationSubscriber } from "@subscribers/chan_invitation.subscriber";

@Module({
	imports: [MessageModule, UserModule, AuthModule, ChannelModule, ChanConnectionModule],
	controllers: [],
	providers: [
		ChatGateway,
		SocketService,
		RelationSubscriber,
		ChannelSubscriber,
		ChanConnectionSubscriber,
		ChanInvitationSubscriber,
		MessageSubscriber,
	],
})
export class ChatModule {}
