import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "@src/controllers/app.controller";
import { UserService } from "@services/user.service";
import { User } from "@entities/user.entity";
import { Channel } from "@entities/channel.entity";
import { ChannelService } from "@services/channel.service";
import { ChanConnection } from "@entities/chan_connection.entity";
import { ChanConnectionService } from "@services/chan_connection.service";

@Module({
	imports: [TypeOrmModule.forFeature([ChanConnection, User, Channel])],
	providers: [ChanConnectionService, UserService, ChannelService],
	controllers: [AppController],
	exports: [ChanConnectionService, UserService, ChannelService],
})
export class ChanConnectionModule {}
