import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
// import { UserService } from "@src/services/user.service";
// import { ClientService } from "@services/client.service";
import { AppController } from "@src/controllers/app.controller";
import { Game } from "@src/entities/game.entity";
import { GameService } from "@services/game.service";
import { ClientService } from "@services/client.service";
import { Client } from "@entities/client.entity";

@Module({
	imports: [TypeOrmModule.forFeature([Game, Client])],
	providers: [GameService, ClientService],
	controllers: [AppController],
	exports: [GameService, ClientService],
})
export class GameModule {}
