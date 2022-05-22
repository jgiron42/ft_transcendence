import { AppController } from "@controllers/app.controller";
import { Module } from "@nestjs/common";
import { AuthModule } from "@modules/auth.module";

@Module({
	imports: [AuthModule],
	controllers: [AppController],
})
export class AppModule {}
