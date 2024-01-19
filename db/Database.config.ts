import mysql, { ConnectionOptions } from "mysql2/promise.js";
import { ConfigService } from "../config/configService.class.js";

const configService = new ConfigService();

const startTimer = Date.now();

const access: ConnectionOptions = {
	host: configService.get("SQL_HOST"),
	database: configService.get("SQL_DATABASE"),
	password: configService.get("SQL_PASSWORD"),
	port: +configService.get("SQL_PORT"),
	user: configService.get("SQL_USER")
};

export const connection = await mysql.createConnection(access).catch(err => {
	console.log("Database connection wasn't completed, because: \n ", err);
	throw err;
});	

await connection.connect()
	.catch(err => {
		console.log("Database connection wasn't completed, because: \n ", err);
		throw err;
	});	

console.log(
	`${"-".repeat(90)} \n` +

	"Database connection was completed. \n" +
	`   for: ${Date.now() - startTimer} milliseconds. \n` +
	`   in ${new Date(Date.now())}. \n` +

	`${"-".repeat(90)} \n` 
);
