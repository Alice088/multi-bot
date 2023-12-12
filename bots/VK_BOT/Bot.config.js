import { VK } from "vk-io";
import { ConfigService } from "../../config/config.service.js";
import { StartCommand } from "./commands/Start.command.js";
import { ChattingScene } from "./scenes/Chatting.scene.js";

class Bot {
	bot;
	actions;
    
	constructor(configService) {
		this.bot = new VK({
			token: configService.get("TOKEN_VK"),
			apiVersion: "5.199"
		} );
	}

	async init() {
		const startInit = Date.now();

		this.actions = [
			new StartCommand(this.bot),
			new ChattingScene(this.bot)
		];

		for (const action of this.actions) {
			action.handle();
		}
		
		await this.bot.updates.startPolling().catch((err) => console.error("Error during starting VK BOT: " + err));
		
		const endInit = Date.now();

		console.log(
			`VK Bot has been started! for: \n ${endInit - startInit} milliseconds \n in ${new Date(Date.now())} \n`
		);
	}
}

const bot = new Bot(new ConfigService());
bot.init();