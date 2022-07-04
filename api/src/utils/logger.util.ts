import * as winston from "winston";
import colors from "colors";

const levels = {
	error: 0,
	warn: 1,
	info: 2,
	http: 3,
	debug: 4,
};

const level = () => {
	const env = process.env.NODE_ENV || "development";
	const isDevelopment = env === "development";
	return isDevelopment ? "debug" : "warn";
};

const logColors = {
	error: "red",
	warn: "yellow",
	info: "green",
	http: "magenta",
	debug: "white",
};

winston.addColors(logColors);

const format = winston.format.combine(
	winston.format.timestamp({ format: "YYYY/MM/DD, HH:mm:ss:ms     " }),
	winston.format.colorize({ all: true }),
	winston.format.printf(
		(info: winston.Logform.TransformableInfo) =>
			`[${info.level}] - ${colors.white(info.timestamp as string)} ${info.message}`,
	),
);

const transports = [
	new winston.transports.Console(),
	new winston.transports.File({
		filename: "logs/error.log",
		level: "error",
	}),
	new winston.transports.File({ filename: "logs/all.log" }),
];

const Logger = winston.createLogger({
	level: level(),
	levels,
	format,
	transports,
});

export default Logger;
