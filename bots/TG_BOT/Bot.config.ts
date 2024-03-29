import { Scenes, Telegraf, session } from "telegraf";
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
import { ChattingScene } from "./Scenes/Chatting.scene.js";
import { ChattingCommand } from "./Commands/Chatting.command.js";
import { UsersSessions } from "./Session/UsersSessions.class.js";

class Bot {
	public  bot				   : Telegraf<IBotContext>																																								;
	private commands	   : Command[]        																																					 			= [];
	private middlewares  : Middleware[]     																																					 			= [];
	private scenes		   : Scenes.Stage<Scenes.WizardContext<Scenes.WizardSessionData>, Scenes.SceneSessionData>[] 					= [];
	public  usersSessions: UsersSessions																																									;

	constructor(private readonly configService: IConfigService) {
		this.bot 					 = new Telegraf<IBotContext>(configService.get("TOKEN_TG"));
		this.usersSessions = new UsersSessions();

		this.scenes = [
			new Scenes.Stage<Scenes.WizardContext>([new ChattingScene("Chatting", this.usersSessions).scene])
		];

		this.bot.use(session());
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		this.bot.use(this.scenes[0].middleware() as any);
	}

	async init() {
		this.commands = [
			new StartCommand(this.bot),
			new HomeCommand(this.bot),
			new InfoCommand(this.bot),
			new SavedPeopleCommand(this.bot, this.usersSessions),
			new ChattingCommand(this.bot, this.usersSessions)
		];

		this.middlewares = [
			new AuthenticationMiddleware(this.bot, this.usersSessions),
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

