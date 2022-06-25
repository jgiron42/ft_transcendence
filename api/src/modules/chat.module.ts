import { Module } from "@nestjs/common";
import { ChatGateway } from "@gateways/chat.gateway";
import { MessageModule } from "@modules/message.module";
import { UserModule } from "@modules/user.module";
import { AuthModule } from "@modules/auth.module";

@Module({
	imports: [MessageModule, UserModule, AuthModule],
	controllers: [],
	providers: [ChatGateway],
})
export class ChatModule {}
