import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
// import { UserService } from "@src/services/user.service";
// import { ClientService } from "@services/client.service";
import { AppController } from "@src/controllers/app.controller";
import { Relation } from "@src/entities/relation.entity";
import { RelationService } from "@services/relation.service";
import { ClientService } from "@services/client.service";
import { Client } from "@entities/client.entity";

@Module({
	imports: [TypeOrmModule.forFeature([Relation, Client])],
	providers: [RelationService, ClientService],
	controllers: [AppController],
	exports: [RelationService, ClientService],
})
export class RelationModule {}
