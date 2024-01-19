import { Markup, Telegraf } from "telegraf";
import { Command } from "./Commad.class.js";
import { IBotContext } from "../Context/Context.interface.js";

export class InfoCommand extends Command {
	constructor(bot: Telegraf<IBotContext>) {
		super(bot);
	}

	handle(): void {
		this.bot.action("Whats_this", (ctx) => {
			ctx.editMessageText(
				"Это opensource пет-проект человека Alice088, " +
        "он сделан, чтобы облегчить жизнь людям которым лень заходить в вк или телеграм, чтобы написать своим друзьям, " +
        "поэтому этот бот помогает вам общаться с друзьями через ботов, он устанавливает связь между вами с помощью " +
        "Longpolling и очереди сообщений благодаря чему вы можете свободно общаться. \n" +
        "GitHub: https://github.com/Alice088/multi-bot",
				Markup.inlineKeyboard([
					Markup.button.callback("Домой🏠", "back_to_home"),
				])
			);
		});
  
		this.bot.command("info", (ctx) => {
			ctx.sendMessage(
				"Это opensource пет-проект человека Alice088, " +
        "он сделан, чтобы облегчить жизнь людям которым лень заходить в вк или телеграм, чтобы написать своим друзьям, " +
        "поэтому этот бот помогает вам общаться с друзьями через ботов, он устанавливает связь между вами с помощью " +
        "Longpolling и очереди сообщений благодаря чему вы можете свободно общаться. \n" +
        "GitHub: https://github.com/Alice088/multi-bot",
				Markup.inlineKeyboard([
					Markup.button.callback("Домой🏠", "back_to_home"),
				])
			);
		});
	}
}