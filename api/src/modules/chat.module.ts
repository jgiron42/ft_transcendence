import { Module } from '@nestjs/common';
import { AppGateway } from '@gateways/chat.gateway';

@Module({
	imports: [],
	controllers: [],
	providers: [AppGateway],
})
export class ChatModule {}
