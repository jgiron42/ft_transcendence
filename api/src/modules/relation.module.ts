import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "@src/controllers/app.controller";
import { Relation } from "@src/entities/relation.entity";
import { RelationService } from "@services/relation.service";
import { UserService } from "@services/user.service";
import { User } from "@entities/user.entity";
import { AuthModule } from "./auth.module";

@Module({
	imports: [TypeOrmModule.forFeature([Relation, User]), AuthModule],
	providers: [RelationService, UserService],
	controllers: [AppController],
	exports: [RelationService, UserService],
})
export class RelationModule {}
