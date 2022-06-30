import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "@src/controllers/app.controller";
import { UserService } from "@services/user.service";
import { User } from "@entities/user.entity";
import { Channel } from "@entities/channel.entity";
import { ChannelService } from "@services/channel.service";
import { ChanConnectionModule } from "@modules/chan_connection.module";
import { ChanConnection } from "@entities/chan_connection.entity";
import { AuthModule } from "./auth.module";
import { UserModule } from "./user.module";

@Module({
	imports: [
		TypeOrmModule.forFeature([ChanConnection, Channel, User]),
		forwardRef(() => AuthModule),
		ChanConnectionModule,
		forwardRef(() => UserModule),
	],
	providers: [ChannelService, UserService],
	controllers: [AppController],
	exports: [ChannelService, UserService],
})
export class ChannelModule {}
