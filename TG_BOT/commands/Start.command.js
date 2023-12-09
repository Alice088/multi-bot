import { Command } from "./Command.class.js";
import { Markup } from "telegraf";

export class StartCommand extends Command{
	constructor(bot) {
		super(bot);
	}

	handle() {
		this.bot.start((ctx) => {
			console.log(ctx.session);
			ctx.reply("Добро пожаловать в Мульти-Бот👋🏻)", Markup.inlineKeyboard([
				Markup.button.callback("Начать поиск людей", "find"),
				Markup.button.callback("Сохраненные люди", "savedPeople")
			]));

			setTimeout(() => {
				ctx.sendSticker({
					chat_id: ctx.session.id
				});
			}, 1000);
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