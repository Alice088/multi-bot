import { Markup, Telegraf } from "telegraf";
import { Command } from "./Commad.class.js";
import { IBotContext } from "../Context/Context.interface.js";
import { stickers } from "../Stickers/Stickers.class.js";

export class StartCommand extends Command {
	constructor(bot: Telegraf<IBotContext>) {
		super(bot);
	}

	handle(): void {
		this.bot.start(async (ctx) => {
			await ctx.sendSticker(stickers.get("Colobok_durak"), {
			});

			await ctx.reply(
				`Добро пожаловать в Мульти-бот, ${ctx.message.from.first_name}!🥳`,
				Markup.inlineKeyboard([
					[Markup.button.callback("Начать общение🗣", "Start_chatting")],
					[Markup.button.callback("Сохраненные люди👨‍👦‍👦", "Saved_people")],
					[Markup.button.callback("Что это такое?🧐", "Whats_this")],
				])
			);
		});
    
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
	}
}