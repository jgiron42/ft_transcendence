import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "@entities/user.entity";
import { Channel } from "@entities/channel.entity";
import { Message } from "@entities/message.entity";
import { MessageService } from "@services/message.service";
import { UserModule } from "@modules/user.module";
import { MessagesController } from "@controllers/messages.controller";
import { AuthModule } from "./auth.module";

@Module({
	imports: [
		TypeOrmModule.forFeature([Message, User, Channel]),
		forwardRef(() => AuthModule),
		forwardRef(() => UserModule),
	],
	providers: [MessageService],
	controllers: [MessagesController],
	exports: [MessageService],
})
export class MessageModule {}
