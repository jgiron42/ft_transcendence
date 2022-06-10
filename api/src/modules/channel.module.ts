import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "@src/controllers/app.controller";
import { UserService } from "@services/user.service";
import { User } from "@entities/user.entity";
import { Channel } from "@entities/channel.entity";
import { ChannelService } from "@services/channel.service";
import { MessageService } from "@services/message.service";
import { Message } from "@entities/message.entity";
import { AuthModule } from "./auth.module";

@Module({
	imports: [TypeOrmModule.forFeature([Channel, User, Message]), AuthModule],
	providers: [ChannelService, UserService, MessageService],
	controllers: [AppController],
	exports: [ChannelService, UserService, MessageService],
})
export class ChannelModule {}
