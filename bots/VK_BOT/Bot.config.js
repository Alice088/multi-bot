import { VK } from "vk-io";
import { ConfigService } from "../../config/config.service.js";
import { Keyboard } from "vk-io";
import { SceneManager, StepScene } from "@vk-io/scenes";
import { SessionManager } from "@vk-io/session";

import { startCommand } from "./commands/start.command.js";
import { firstTimeCommand } from "./commands/firstTime.command.js";
import { homeCommand } from "./commands/home.command.js";
import { savedPeopleCommand } from "./commands/savedPeople.command.js";

import { chattingScene } from "./scenes/chatting.scene.js";
import { authMiddleware } from "./middleware/Auth.middleware.js";
import { editContextTextToLowerCaseMiddleware } from "./middleware/editContextTextToLowerCase.middleware.js";

import { UserContext } from "./classes/UserContext.class.js";
import { QueueOfRequests } from "../../dist/controllers/QueueOfRequests.controller.js";
import { MessageRequest } from "../../dist/controllers/MessageRequest.controller.js";

class Bot {
	bot;
	sessionManager = new SessionManager();
	sceneManager = new SceneManager();
	StepScene = StepScene;
	Keyboard = Keyboard;
	userContext = new UserContext();
	queueOfRequests = new QueueOfRequests();
	messageRequest = new MessageRequest();

	constructor(configService) {
		this.bot = new VK({
			token: configService.get("TOKEN_VK")
		});
	}

	initMiddlewares() {
		this.bot.updates.on("message_new", this.sessionManager.middleware);
		this.bot.updates.on("message_new", this.sceneManager.middleware);
		this.bot.updates.on("message_new", authMiddleware.bind(this));
		this.bot.updates.on("message_new", editContextTextToLowerCaseMiddleware);

		return this;
	}

	initActions(...actions) {
		for (const action of actions) {
			action.call(this);
		}

		return this;
	}

	async initBot() {
		const startInit = Date.now();

		await this.bot.updates.start()
			.then(() => {
				console.log(
					`${"-".repeat(90)} \n` +

					"VK Bot has been started! \n" +
					`  for: ${Date.now() - startInit} milliseconds \n` +
					`  in ${new Date(Date.now())} \n` +

					`${"-".repeat(90)} \n`
				);
			})
			.catch((err) => console.error("Error during start VK BOT: " + err));
	}

	initKeyboardSetting() {
		this.Keyboard.defaultKeyboard = [
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

		this.Keyboard.homeButton = this.Keyboard.textButton({
			label: "Домой",
			color: "negative",
		});

		this.Keyboard.leftArrow = (payload) => {
			return this.Keyboard.callbackButton({
				label: "⬅️",
				color: "positive",
				payload: payload
			});
		};

		this.Keyboard.rightArrow = (payload) => {
			return this.Keyboard.callbackButton({
				label: "➡️",
				color: "positive",
				payload: payload
			});
		};

		this.Keyboard.stopButton = () => {
			return this.Keyboard.callbackButton({
				label: "⛔",
				color: "negative",
				payload: {}
			});
		};

		return this;
	}
}

export const bot = new Bot(new ConfigService());

bot
	.initMiddlewares()
	.initActions(
		startCommand,
		firstTimeCommand,
		homeCommand,
		savedPeopleCommand,
		chattingScene
	)
	.initKeyboardSetting()
	.initBot()
;