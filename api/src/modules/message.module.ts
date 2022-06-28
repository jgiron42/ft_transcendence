import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "@src/controllers/app.controller";
import { User } from "@entities/user.entity";
import { Channel } from "@entities/channel.entity";
import { Message } from "@entities/message.entity";
import { MessageService } from "@services/message.service";
import { UserModule } from "@modules/user.module";
import { SocketService } from "@services/socket.service";
import { AuthModule } from "./auth.module";

@Module({
	imports: [
		TypeOrmModule.forFeature([Message, User, Channel]),
		forwardRef(() => AuthModule),
		forwardRef(() => UserModule),
	],
	providers: [MessageService, SocketService],
	controllers: [AppController],
	exports: [MessageService],
})
export class MessageModule {}
