import { bot } from "./Bot.config.js";

const commands = [
	{
		command: "start",
		description: "Запуск бота"
	},
	{   
		command: "help",
		description: "Раздел помощи"
	},
	{
		command: "info",
		description: "информация о боте"
	},
];

bot.setMyCommands(commands);