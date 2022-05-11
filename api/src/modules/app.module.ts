import { AppController } from "@controllers/app.controller";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "@src/entities/user.entity";
import { UsersModule } from "./users.module";

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: "postgres",
			host: "db",
			port: 5432,
			username: process.env.POSTGRES_USER,
			password: process.env.POSTGRES_PASSWORD,
			database: process.env.POSTGRES_DB,
			entities: [User],
			synchronize: true,
		}),
		UsersModule,
	],
	controllers: [AppController],
})
export class AppModule {}
