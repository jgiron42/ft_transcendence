import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "@src/controllers/app.controller";
import { UserService } from "@services/user.service";
import { User } from "@entities/user.entity";
import { Channel } from "@entities/channel.entity";
import { ChannelService } from "@services/channel.service";

@Module({
	imports: [TypeOrmModule.forFeature([Channel, User])],
	providers: [ChannelService, UserService],
	controllers: [AppController],
	exports: [ChannelService, UserService],
})
export class ChannelModule {}
