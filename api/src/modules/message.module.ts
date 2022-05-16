import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "@src/controllers/app.controller";
import { UserService } from "@services/user.service";
import { User } from "@entities/user.entity";
import { Channel } from "@entities/channel.entity";
import { Message } from "@entities/message.entity";
import { MessageService } from "@services/message.service";
import { ChannelService } from "@services/channel.service";

@Module({
	imports: [TypeOrmModule.forFeature([Message, User, Channel])],
	providers: [MessageService, UserService, ChannelService],
	controllers: [AppController],
	exports: [MessageService, UserService, ChannelService],
})
export class MessageModule {}
