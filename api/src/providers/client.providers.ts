import { Connection } from "typeorm";
import { Client } from "@entities/client.entity";

export const clientProviders = [
	{
		provide: "CLIENT_REPOSITORY",
		useFactory: (connection: Connection) => connection.getRepository(Client),
		inject: ["DATABASE_CONNECTION"],
	},
];
