import { Module } from "@nestjs/common";
import { AppGateway } from "@gateways/app.gateway";
import { ChatGateway } from "@gateways/chat.gateway";
import { ChatService } from "@services/chat.service";
import { MessageModule } from "@modules/message.module";
import { AuthService } from "@services/auth.service";
import { SocketService } from "@services/socket.service";

@Module({
	imports: [MessageModule],
	controllers: [],
	providers: [AppGateway, ChatGateway, ChatService, AuthService, SocketService],
})
export class ChatModule {}
