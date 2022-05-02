import "reflect-metadata";
import { DataSource } from "typeorm";
import { client } from "./entity/client";
import { relation } from "./entity/relation";
import { chan_connexion } from "./entity/chan_connexion";
import { channel } from "./entity/channel";
import { game } from "./entity/game";

export const AppDataSource = new DataSource({
	type: "postgres",
	host: "localhost",
	port: 5432,
	username: "test",
	password: "test",
	database: "test",
	synchronize: true,
	logging: false,
	entities: [client, relation, chan_connexion, channel, game],
	migrations: [],
	subscribers: [],
});
