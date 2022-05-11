import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserService } from "@src/services/user.service";
import { AppController } from "@src/controllers/app.controller";
import { User } from "@src/entities/user.entity";

@Module({
	imports: [TypeOrmModule.forFeature([User])],
	providers: [UserService],
	controllers: [AppController],
	exports: [UserService],
})
export class UsersModule {}
