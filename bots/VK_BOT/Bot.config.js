import { VK } from "vk-io";
import { ConfigService } from "../../config/config.service.js";
import { startCommand } from "./commands/start.command.js";
import { chattingScene } from "./scenes/chatting.scene.js";
import { SessionManager } from "@vk-io/session";
import { SceneManager, StepScene } from "@vk-io/scenes";

class Bot {
	bot;
	sessionManager;
	sceneManager;
	StepScene;
    
	constructor(configService) {
		this.bot = new VK({
			token: configService.get("TOKEN_VK"),
			apiVersion: "5.199"
		} );
		this.sessionManager = new SessionManager();
		this.sceneManager = new SceneManager();
		this.StepScene = StepScene;
	}
    
	initActions(...actions) {
		this.bot.updates.on("message_new", this.sessionManager.middleware);
		this.bot.updates.on("message_new", this.sceneManager.middleware);

		for (const action of actions) {
			action.call(this);
		}
        
		return this;
	}

	async initBot() {
		const startInit = Date.now();
		
		await this.bot.updates.startPolling()
			.then(() => {
				console.log(
					`${"-".repeat(90)} \n` +

					"VK Bot has been started! \n" +
					`  for: ${Date.now() - startInit} milliseconds \n` + 
					`  in ${new Date(Date.now())} \n` +

					`${"-".repeat(90)} \n`
				);
			})
			.catch((err) => console.error("Error during starting VK BOT: " + err));
	}
}

const bot = new Bot(new ConfigService());
bot
	.initActions(startCommand, chattingScene)
	.initBot();