import "reflect-metadata";
import { DataSource } from "typeorm";
import { Client } from "@entities/client.entity";
import { Relation } from "@entities/relation.entity";
import { ChanConnection } from "@entities/chan_connexion.entity";
import { Channel } from "@entities/channel.entity";
import { Game } from "@entities/game.entity";

export const AppDataSource = new DataSource({
	type: "postgres",
	host: "db",
	port: 5432,
	username: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
	database: process.env.POSTGRES_DB,
	synchronize: true,
	logging: true,
	entities: [Client, Relation, ChanConnection, Channel, Game],
	migrations: [],
	subscribers: [],
});
