import { Module } from "@nestjs/common";
import { DatabaseModule } from "@modules/database.module";
import { clientProviders } from "@providers/client.providers";
import { ClientService } from "@services/client.service";
import { AppController } from "@src/controllers/app.controller";

@Module({
	imports: [DatabaseModule],
	controllers: [AppController],
	providers: [...clientProviders, ClientService],
	exports: [ClientService],
})
export class ClientModule {}
