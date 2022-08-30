import { User } from "@entities/user.entity";
import { Relation } from "@entities/relation.entity";
import { Channel } from "@entities/channel.entity";
import { Message } from "@entities/message.entity";
import { ChanConnection } from "@entities/chan_connection.entity";
import { ChanInvitation } from "@entities/chan_invitation.entity";
import { Game } from "@src/entities/game.entity";

export const config = {
	type: "postgres",
	host: process.env.POSTGRES_HOST || "db",
	port: Number(process.env.POSTGRES_PORT) || 5432,
	username: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
	database: process.env.POSTGRES_DB,
	entities: [User, Relation, Game, Channel, Message, ChanConnection, ChanInvitation],
	synchronize: process.env.NODE_ENV !== "production",
	dropSchema: process.env.NODE_ENV !== "production",
};
