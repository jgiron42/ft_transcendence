import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "@src/controllers/app.controller";
import { User } from "@entities/user.entity";
import { Channel } from "@entities/channel.entity";
import { ChanConnection } from "@entities/chan_connection.entity";
import { ChanConnectionService } from "@services/chan_connection.service";
import { UserModule } from "@modules/user.module";
import { AuthModule } from "./auth.module";

@Module({
	imports: [TypeOrmModule.forFeature([ChanConnection, User, Channel]), AuthModule, forwardRef(() => UserModule)],
	providers: [ChanConnectionService],
	controllers: [AppController],
	exports: [ChanConnectionService],
})
export class ChanConnectionModule {}
