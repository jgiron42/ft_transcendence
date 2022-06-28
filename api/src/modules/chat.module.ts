import { Module } from "@nestjs/common";
import { ChatGateway } from "@gateways/chat.gateway";
import { MessageModule } from "@modules/message.module";
import { UserModule } from "@modules/user.module";
import { AuthModule } from "@modules/auth.module";
import { ChannelModule } from "@modules/channel.module";
import { ChanConnectionModule } from "@modules/chan_connection.module";
import { SocketService } from "@services/socket.service";

@Module({
	imports: [MessageModule, UserModule, AuthModule, ChannelModule, ChanConnectionModule],
	controllers: [],
	providers: [ChatGateway, SocketService],
})
export class ChatModule {}
