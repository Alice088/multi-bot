import { bot } from "./Bot.config.js";
import { botController } from "./Bot.contoller.js";

bot.onText(/\/start/, botController.onWelcome);
bot.onText(/\/info/, botController.onInfo);

