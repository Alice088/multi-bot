import { Markup, Telegraf } from "telegraf";
import { Command } from "./Commad.class.js";
import { IBotContext } from "../Context/Context.interface.js";

export class HomeCommand extends Command {
	constructor(bot: Telegraf<IBotContext>) {
		super(bot);
	}

	handle(): void {
		this.bot.action("back_to_home", (ctx) => {
			ctx.editMessageText(
				"Добро пожаловать домой!🏠",
				Markup.inlineKeyboard([
					[Markup.button.callback("Начать общение🗣", "Start_chatting")],
					[Markup.button.callback("Сохраненные люди👨‍👦‍👦", "Saved_people")],
					[Markup.button.callback("Что это такое?🧐", "Whats_this")],
				]));
		});
	}
}