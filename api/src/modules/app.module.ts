import { AppController } from "@controllers/app.controller";
import { Module } from "@nestjs/common";
import { ClientModule } from "./client.module";

@Module({
	imports: [ClientModule],
	controllers: [AppController],
})
export class AppModule {}
