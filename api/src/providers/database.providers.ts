import { createConnection } from "typeorm";

console.log("lol:", `${__dirname}/../entities/*.entity{.ts,.js}`);

export const databaseProviders = [
	{
		provide: "DATABASE_CONNECTION",
		useFactory: async () =>
			await createConnection({
				type: "postgres",
				host: "db",
				port: 5432,
				username: process.env.POSTGRES_USER,
				password: process.env.POSTGRES_PASSWORD,
				database: process.env.POSTGRES_DB,
				entities: ["./client.entity.js", "./client.entity.ts"],
				synchronize: true,
			}),
	},
];
