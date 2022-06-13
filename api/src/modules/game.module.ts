import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "@src/controllers/app.controller";
import { Game } from "@src/entities/game.entity";
import { GameService } from "@services/game.service";
import { User } from "@entities/user.entity";
import { UserModule } from "@modules/user.module";
import { AuthModule } from "./auth.module";

@Module({
	imports: [TypeOrmModule.forFeature([Game, User]), AuthModule, forwardRef(() => UserModule)],
	providers: [GameService],
	controllers: [AppController],
	exports: [GameService],
})
export class GameModule {}
