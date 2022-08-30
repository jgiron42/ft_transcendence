import "reflect-metadata";
import { existsSync, mkdirSync } from "fs";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "@modules/app.module";
import helmet from "helmet";
import morgan from "morgan";
import config from "@config/api.config";
import session from "express-session";
import { Container } from "typedi";
import { useContainer } from "class-validator";
import connect_pg_simple from "connect-pg-simple";
import { config as dbConfig } from "@config/db.config";

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
	const store = new (connect_pg_simple(session))({
		conObject: {
			host: dbConfig.host,
			port: dbConfig.port,
			user: dbConfig.username,
			password: dbConfig.password,
			database: dbConfig.database,
		},
		createTableIfMissing: true,
		pruneSessionInterval: 60,
	});

	Container.set("SessionStore", store);

	// create upload dir if it doesn't exist
	if (!existsSync(config.uploadsPath)) mkdirSync(config.uploadsPath);

	// Instanciate Nest app
	const app = await NestFactory.create(AppModule);

	// Enable session
	app.use(
		session({
			store,
			secret: config.sessionSecret,
			resave: true,
			saveUninitialized: false,
			cookie: {
				sameSite: "strict",
				httpOnly: false,
				maxAge: 1000 * config.sessionTimeout,
			},
			rolling: true,
			unset: "destroy",
		}),
	);

	// Enable helmet for saner security default
	app.use(helmet());

	// Enable Cross Origin Resource Sharing
	app.enableCors(config.cors);

	// Enable morgan for clean logs
	app.use(morgan("combined"));

	//	class-validator
	useContainer(app.select(AppModule), { fallbackOnErrors: true });

	// Start server and listen for requests
	await app.listen(config.apiPort);
})();
