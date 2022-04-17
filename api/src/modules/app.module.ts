import { AppController } from "@controllers/app.controller";
import { Module } from "@nestjs/common";

@Module({
	controllers: [AppController],
})
export class AppModule {}
