/* eslint-disable @typescript-eslint/no-explicit-any */
import { Markup, Telegraf } from "telegraf";
import { Command } from "./Commad.class.js";
import { IBotContext } from "../Context/Context.interface.js";

export class ChattingCommand extends Command {
	constructor(bot: Telegraf<IBotContext>) {
		super(bot);
	}

	handle(): void {
		this.bot.command("chatting", async (ctx: any) => {
			await ctx.sendMessage("Напишите @@Юзернейм человека(с двумя '@@')", Markup.keyboard([
				Markup.button.text("Домой🏠")
			])
				.resize()
				.oneTime());

			await ctx.scene.enter("Chatting");
		});

		this.bot.action("Start_chatting", async (ctx: any) => {
			await ctx.deleteMessage(ctx.update.callback_query.message.message_id);

			await ctx.sendMessage("Напишите Юзернейм человека(он уже должен быть быть в базе польвателей бота)",  Markup.keyboard([
				Markup.button.text("Домой🏠")
			])
				.resize()
				.oneTime());

			await ctx.scene.enter("Chatting");
		});
	}
}