import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "@src/controllers/app.controller";
import { User } from "@entities/user.entity";
import { UserService } from "@services/user.service";
import { AuthModule } from "./auth.module";

@Module({
	imports: [TypeOrmModule.forFeature([User]), AuthModule],
	providers: [UserService],
	controllers: [AppController],
	exports: [UserService],
})
export class UserModule {}
