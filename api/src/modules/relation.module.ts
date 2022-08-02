import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Relation } from "@src/entities/relation.entity";
import { RelationService } from "@services/relation.service";
import { User } from "@entities/user.entity";
import { UserModule } from "@modules/user.module";
import { RelationsController } from "@controllers/relations.controller";
import { AuthModule } from "./auth.module";

@Module({
	imports: [TypeOrmModule.forFeature([Relation, User]), forwardRef(() => AuthModule), forwardRef(() => UserModule)],
	providers: [RelationService],
	controllers: [RelationsController],
	exports: [RelationService],
})
export class RelationModule {}
