import { Module, Logger } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "@src/controllers/app.controller";
import { UserService } from "@services/user.service";
import { User } from "@entities/user.entity";
import { Channel } from "@entities/channel.entity";
import { ChannelService } from "@services/channel.service";
import { ChanConnectionModule } from "@modules/chan_connection.module";
import { ChanConnection } from "@entities/chan_connection.entity";
import { SocketService } from "@services/socket.service";
import { MessageService } from "@services/message.service";
import { AuthModule } from "./auth.module";

@Module({
	imports: [TypeOrmModule.forFeature([ChanConnection, Channel, User]), AuthModule, ChanConnectionModule],
	providers: [ChannelService, UserService, SocketService],
	controllers: [AppController],
	exports: [ChannelService, UserService, MessageService],
})
export class ChannelModule {
	private logger: Logger = new Logger("ChannelModule");

	constructor(@InjectRepository(Channel) private channelRepository: Repository<Channel>) {
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		this.createRealm();
	}

	async createRealm(): Promise<void> {
		try {
			await this.channelRepository.save(new Channel("realm", undefined));
			this.logger.log("Realm created.");
		} catch (e) {
			this.logger.error(e);
		}
	}
}
