import { SceneManager, StepScene } from "@vk-io/scenes";
import { HearManager } from "@vk-io/hear";

export class ChattingScene {
	bot;
	sceneManager;
	hearManager;
    
	constructor(bot) {
		this.bot = bot;
		this.sceneManager = new SceneManager();
		this.hearManager = new HearManager();
	}

	handle() {
		this.bot.updates.on("message", this.sceneManager.middleware);
		this.hearManager.hear("Ваши сохранненые люди", (ctx) => {
			console.log("Ваши сохранненые люди")
		});
	}
}