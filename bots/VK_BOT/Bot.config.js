import { VK } from "vk-io";
import { ConfigService } from "../../config/config.service.js";
import { Keyboard } from "vk-io";
import { startCommand } from "./commands/start.command.js";
import { firstTime } from "./commands/firstTime.command.js";
import { chattingScene } from "./scenes/chatting.scene.js";
import { SessionManager } from "@vk-io/session";
import { SceneManager, StepScene } from "@vk-io/scenes";

class Bot {
	bot;
	sessionManager = new SessionManager();
	sceneManager = new SceneManager();
	StepScene = StepScene;
	Keyboard = Keyboard;
	defaultKeyboard = [
		this.Keyboard.textButton({
			label: "Начать общение",
			color: "positive",
		}),

		this.Keyboard.textButton({
			label: "Ваши сохранненые люди",
			color: "primary",
		}),

		this.Keyboard.textButton({
			label: "Я впервые пользуюсь этим ботом",
			color: "primary",
		}),
	];
    
	constructor(configService) {
		this.bot = new VK({
			token: configService.get("TOKEN_VK"),
			apiVersion: "5.199"
		} );
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

export const bot = new Bot(new ConfigService());

bot
	.initActions(startCommand, firstTime, chattingScene)
	.initBot()
;