import { AppController } from "@controllers/app.controller";
import { Module } from "@nestjs/common";
import { AuthModule } from "@modules/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "@modules/user.module";
import { RelationModule } from "@modules/relation.module";
import { StoredGameModule } from "@modules/stored-game.module";
import { ChannelModule } from "@modules/channel.module";
import { ChanConnectionModule } from "@modules/chan_connection.module";
import { ChanInvitationModule } from "@modules/chan_invitation.module";
import { ChatModule } from "@modules/chat.module";
import { GameModule } from "@modules/game.module";
import { ScheduleModule } from "@nestjs/schedule";
import { RelationsController } from "@controllers/relations.controller";
import { MessagesController } from "@controllers/messages.controller";
import { ChannelsController } from "@controllers/channels.controller";
import { GamesController } from "@controllers/games.controller";
import { config } from "@src/config/db.config";
import { MessageModule } from "./message.module";

@Module({
	imports: [
		TypeOrmModule.forRoot({ ...config, type: "postgres" }),
		UserModule,
		RelationModule,
		StoredGameModule,
		ChannelModule,
		ChanConnectionModule,
		ChanInvitationModule,
		AuthModule,
		ChatModule,
		GameModule,
		ScheduleModule.forRoot(),
		MessageModule,
	],
	controllers: [AppController, RelationsController, MessagesController, ChannelsController, GamesController],
})
export class AppModule {}
