import { Telegraf, session } from "telegraf";
import { ConfigService } from "../../config/config.service.js";
import { IConfigService } from "../../config/IConfigService.js";
import { IBotContext } from "./Context/Context.interface.js";
import { Command } from "./Commands/Commad.class.js";
import { StartCommand } from "./Commands/Start.command.js";
import { HomeCommand } from "./Commands/Home.command.js";

class Bot {
	bot: Telegraf<IBotContext>;
	commands: Command[] = [];

	constructor(private readonly configService: IConfigService) {
		this.bot = new Telegraf<IBotContext>(configService.get("TOKEN_TG"));
		this.bot.use(session()).middleware();
	}

	async init() {
		this.commands = [new StartCommand(this.bot), new HomeCommand(this.bot)];

		for (const command of this.commands) {
			command.handle();
		}

		this.bot.launch({ dropPendingUpdates: true })
			.catch((error) => {
				console.log("Bot was no started");
				throw error;
			});

		console.log(
			`${"-".repeat(90)} \n` +
			"TG Bot has been started! \n" +
			`${"-".repeat(90)} \n`
		);
	}
}

export const bot = new Bot(new ConfigService());
bot.init();

