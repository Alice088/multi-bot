import { session, Telegraf } from "telegraf";
import { ConfigService } from "../config/config.service.js";
import { StartCommand } from "./commands/Start.command.js";

class Bot {
	bot;
	commands = [];
    
	constructor(configService) {
		this.bot = new Telegraf(configService.get("TOKEN_TG"));
		this.bot.use(session());
	}

	init() {
		this.commands = [new StartCommand(this.bot)];

		for (const command of this.commands) {
			command.handle();
		}

		this.bot.launch()
			.then(() => console.log("Bot has been started!"))
			.catch((error) => {
				console.log("Bot has been no started");
				throw error;
			});
	}
}

const bot = new Bot(new ConfigService());
bot.init();
