import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "@entities/user.entity";
import { Channel } from "@entities/channel.entity";
import { ChanConnection } from "@entities/chan_connection.entity";
import { ChanConnectionService } from "@services/chan_connection.service";
import { UserModule } from "@modules/user.module";
import { ChanConnectionsController } from "@controllers/chan-connections.controller";
import { SocketService } from "@services/socket.service";
import { AuthModule } from "./auth.module";

@Module({
	imports: [
		TypeOrmModule.forFeature([ChanConnection, User, Channel]),
		forwardRef(() => AuthModule),
		forwardRef(() => UserModule),
	],
	providers: [ChanConnectionService, SocketService],
	controllers: [ChanConnectionsController],
	exports: [ChanConnectionService],
})
export class ChanConnectionModule {}
