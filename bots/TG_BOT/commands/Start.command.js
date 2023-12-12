import { Markup } from "telegraf";
import { stickers } from "../stickers/mapStickers.js";

export class StartCommand {
	bot;
	
	constructor(bot) {
		this.bot = bot;
	}

	handle() {
		this.bot.start((ctx) => {
			ctx.reply("Добро пожаловать в Мульти-Бот👋🏻!", Markup.inlineKeyboard([
				Markup.button.callback("Начать поиск людей", "find"),
				Markup.button.callback("Сохраненные люди", "savedPeople")
			]));
			
			setTimeout(() => ctx.sendSticker(stickers.get("cute-kitty")), 500 );
		});

		this.bot.hears("/info", (ctx) => {
			ctx.reply(
				"Это бот который позволяет общаться с людьми сквозь телеграм и вк" +
				"этот бот существует потому что мне лень заходить в вк чтобы писать им" +
				"поэтому я создал мульти бот чтобы они и я могли писать в бота и общаться" +
				"внезависимости где они находятся."
			);
		});

		this.bot.action("find", (ctx) => {
			//empty yet
			console.log("find has worked");
		});

		this.bot.action("savedPeople", (ctx) => {
			//empty yet
			ctx.editMessageText("List of saved people");
			console.log("savedPeople has worked");
		});
	}
}