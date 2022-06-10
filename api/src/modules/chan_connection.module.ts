import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "@src/controllers/app.controller";
import { UserService } from "@services/user.service";
import { User } from "@entities/user.entity";
import { Channel } from "@entities/channel.entity";
import { ChannelService } from "@services/channel.service";
import { MessageService } from "@services/message.service";
import { Message } from "@entities/message.entity";
import { ChanConnection } from "@entities/chan_connection.entity";
import { ChanConnectionService } from "@services/chan_connection.service";
import { AuthModule } from "./auth.module";

@Module({
	imports: [TypeOrmModule.forFeature([ChanConnection, User, Channel, Message]), AuthModule],
	providers: [ChanConnectionService, UserService, ChannelService, MessageService],
	controllers: [AppController],
	exports: [ChanConnectionService, UserService, ChannelService, MessageService],
})
export class ChanConnectionModule {}
