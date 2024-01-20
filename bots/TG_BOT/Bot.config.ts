import { Telegraf, session } from "telegraf";
import { ConfigService } from "../../config/configService.class.js";
import { IConfigService } from "../../config/IConfigService.interface.js";
import { IBotContext } from "./Context/Context.interface.js";
import { Command } from "./Commands/Commad.class.js";
import { StartCommand } from "./Commands/Start.command.js";
import { HomeCommand } from "./Commands/Home.command.js";
import { InfoCommand } from "./Commands/Info.command.js";
import { AuthenticationMiddleware } from "./Middlewares/Authentication.middleware.js";
import { Middleware } from "./Middlewares/Middleware.class.js";
import { SavedPeopleCommand } from "./Commands/SavedPeople.command.js";

class Bot {
	bot: Telegraf<IBotContext>;
	private commands: Command[] = [];
	private middlewares: Middleware[] =[];

	constructor(private readonly configService: IConfigService) {
		this.bot = new Telegraf<IBotContext>(configService.get("TOKEN_TG"));
		this.bot.use(session()).middleware();
	}

	async init() {
		this.commands = [
			new StartCommand(this.bot),
			new HomeCommand(this.bot),
			new InfoCommand(this.bot),
			new SavedPeopleCommand(this.bot)
		];

		this.middlewares = [
			new AuthenticationMiddleware(this.bot),
		];

		for (const middleware of this.middlewares) {
			middleware.handle();
		}

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

