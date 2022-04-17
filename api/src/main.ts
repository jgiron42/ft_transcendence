import { NestFactory } from "@nestjs/core";
import { AppModule } from "@modules/app.module";
import helmet from "helmet";
import morgan from "morgan";
import config from "@config/api.config";

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
	// Instanciate Nest app
	const app = await NestFactory.create(AppModule);

	// Enable helmet for saner security default
	app.use(helmet());

	// Enable Cross Origin Resource Sharing
	app.enableCors(config.cors);

	// Enable morgan for clean logs
	app.use(morgan("combined"));

	// Start server and listen for requests
	await app.listen(config.apiPort);
})();
