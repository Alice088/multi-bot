import TelegramBotCreate from "node-telegram-bot-api";
import env from "dotenv";

env.config();

export const bot = new TelegramBotCreate(process.env.TOKEN_TG, {
	polling: true,
});