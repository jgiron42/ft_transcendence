import { AppController } from "@controllers/app.controller";
import { Module } from "@nestjs/common";
import { AuthModule } from "@modules/auth.module";
import { ChatModule } from "@modules/chat.module";

@Module({
	imports: [AuthModule, ChatModule],
	controllers: [AppController],
})
export class AppModule {}
