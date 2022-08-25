import { AppController } from "@controllers/app.controller";
import { Module } from "@nestjs/common";
import { AuthModule } from "@modules/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "@entities/user.entity";
import { UserModule } from "@modules/user.module";
import { Relation } from "@entities/relation.entity";
import { RelationModule } from "@modules/relation.module";
import { StoredGameModule } from "@modules/stored-game.module";
import { Game } from "@entities/game.entity";
import { Channel } from "@entities/channel.entity";
import { ChannelModule } from "@modules/channel.module";
import { Message } from "@entities/message.entity";
import { ChanConnection } from "@entities/chan_connection.entity";
import { ChanConnectionModule } from "@modules/chan_connection.module";
import { ChanInvitation } from "@entities/chan_invitation.entity";
import { ChanInvitationModule } from "@modules/chan_invitation.module";
import { ChatModule } from "@modules/chat.module";
import { GameModule } from "@modules/game.module";
import { ScheduleModule } from "@nestjs/schedule";
import { RelationsController } from "@controllers/relations.controller";
import { MessagesController } from "@controllers/messages.controller";
import { ChannelsController } from "@controllers/channels.controller";
import { GamesController } from "@controllers/games.controller";
import { MessageModule } from "./message.module";

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: "postgres",
			host: process.env.POSTGRES_HOST || "db",
			port: Number(process.env.POSTGRES_PORT) || 5432,
			username: process.env.POSTGRES_USER,
			password: process.env.POSTGRES_PASSWORD,
			database: process.env.POSTGRES_DB,
			entities: [User, Relation, Game, Channel, Message, ChanConnection, ChanInvitation],
			synchronize: process.env.NODE_ENV !== "production",
			dropSchema: process.env.NODE_ENV !== "production",
		}),
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
