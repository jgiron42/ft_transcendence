import { AppController } from "@controllers/app.controller";
import { Module } from "@nestjs/common";
import { AuthModule } from "@modules/auth.module";
import { UsersController } from "@controllers/users.controller";
import { RelationsController } from "@controllers/relations.controller";
import { MessagesController } from "@controllers/messages.controller";
import { ChannelsController } from "@controllers/channels.controller";

@Module({
	controllers: [AppController, UsersController, RelationsController, MessagesController, ChannelsController],
	imports: [AuthModule],
})
export class AppModule {}
