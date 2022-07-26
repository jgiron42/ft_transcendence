import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "@src/controllers/app.controller";
import { Game } from "@src/entities/game.entity";
import { StoredGameService } from "@services/stored-game.service";
import { User } from "@entities/user.entity";
import { UserModule } from "@modules/user.module";
import { AuthModule } from "./auth.module";

@Module({
	imports: [TypeOrmModule.forFeature([Game, User]), forwardRef(() => AuthModule), forwardRef(() => UserModule)],
	providers: [StoredGameService],
	controllers: [AppController],
	exports: [StoredGameService],
})
export class StoredGameModule {}
