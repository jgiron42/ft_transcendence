import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
// import { UserService } from "@src/services/user.service";
import { AppController } from "@src/controllers/app.controller";
import { Client } from "@src/entities/client.entity";
import { ClientService } from "@services/client.service";

@Module({
	imports: [TypeOrmModule.forFeature([Client])],
	providers: [ClientService],
	controllers: [AppController],
	exports: [ClientService],
})
export class ClientModule {}
