import { Module } from "@nestjs/common";
import { ChatGateway } from "@gateways/chat.gateway";
import { MessageModule } from "@modules/message.module";
import { AuthService } from "@services/auth.service";
import { SocketService } from "@services/socket.service";

@Module({
	imports: [MessageModule],
	controllers: [],
	providers: [ChatGateway, AuthService, SocketService],
})
export class ChatModule {}
