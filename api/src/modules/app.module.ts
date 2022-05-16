import { AppController } from "@controllers/app.controller";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Client } from "@src/entities/client.entity";
import { ClientModule } from "@modules/client.module";
import { Relation } from "@entities/relation.entity";
import { RelationModule } from "@modules/relation.module";
import { GameModule } from "@modules/game.module";
import { Game } from "@entities/game.entity";
// import { UsersModule } from "./users.module";

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: "postgres",
			host: "db",
			port: 5432,
			username: process.env.POSTGRES_USER,
			password: process.env.POSTGRES_PASSWORD,
			database: process.env.POSTGRES_DB,
			entities: [Client, Relation, Game],
			synchronize: true,
		}),
		ClientModule,
		RelationModule,
		GameModule,
	],
	controllers: [AppController],
})
export class AppModule {}
