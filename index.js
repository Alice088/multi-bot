import express from "express";
import env from "dotenv";
import "./TG_BOT/Bot.config.js";
import "./TG_BOT/Bot.contoller.js";
import "./TG_BOT/Bot.events.js";
import "./TG_BOT/Bot.commands.js";

const app = express();
env.config();
const port = process.env.PORT ?? 3000;

app.listen(port, () => {
	console.log("server is running on: " + port);
});