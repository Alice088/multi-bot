import { Telegraf } from "telegraf";
import { ConfigService } from "../config/config.service.js";
import { StartCommand } from "./commands/Start.command.js";
import LocalSession from "telegraf-session-local";

class Bot {
	bot;
	commands = [];
    
	constructor(configService) {
		this.bot = new Telegraf(configService.get("TOKEN_TG"));
		this.bot.use(new LocalSession({ database: "session.json" }).middleware());
		//yet here's simple db later I will add well db
	}

	init() {
		this.commands = [new StartCommand(this.bot)];

		for (const command of this.commands) {
			command.handle();
		}

		this.bot.launch({ dropPendingUpdates: true })
			.catch((error) => {
				console.log("Bot has been no started");
				throw error;
			});

		console.log("Bot has been started!");
	}
}

const bot = new Bot(new ConfigService());
bot.init();

