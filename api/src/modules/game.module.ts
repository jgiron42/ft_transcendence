import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Game } from "@src/entities/game.entity";
import { GameService } from "@services/game.service";
import { User } from "@entities/user.entity";
import { UserModule } from "@modules/user.module";
import { GamesController } from "@controllers/games.controller";
import { AuthModule } from "./auth.module";

@Module({
	imports: [TypeOrmModule.forFeature([Game, User]), forwardRef(() => AuthModule), forwardRef(() => UserModule)],
	providers: [GameService],
	controllers: [GamesController],
	exports: [GameService],
})
export class GameModule {}
