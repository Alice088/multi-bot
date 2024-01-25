/* eslint-disable @typescript-eslint/no-explicit-any */
import { Markup, Telegraf } from "telegraf";
import { Command } from "./Commad.class.js";
import { IBotContext } from "../Context/Context.interface.js";
import { UsersSessions } from "../Session/UsersSessions.class.js";
import { getUserByUsername } from "../../../db/contollers/User.controller.js";
import { addSavedPeople } from "../../../db/contollers/SavedPeople.controller.js";


export class ChattingCommand extends Command {
	constructor(bot: Telegraf<IBotContext>, private usersSessions: UsersSessions) {
		super(bot);
	}

	handle(): void {
		this.bot.action(/\b\S*Saved_people_chatting\S*\b/g, async (ctx: any) => {
			const user = this.usersSessions.getUser(ctx.update.callback_query.from.id);
			const interlocutorUsername: string = `"${ctx.match[0].split("~:")[1].replace(/"/g, "")}"`;
			const gotUser = await getUserByUsername(interlocutorUsername);
			await addSavedPeople(user.rowID, gotUser.rows[0].ID, gotUser.rows[0].Telegram_Username, gotUser.rows[0].Vkontakte_Username);

			user.scenes.interlocutor = {
				ID: gotUser.rows[0].ID,
				username: gotUser.rows[0].Telegram_Username ?? gotUser.rows[0].Vkontakte_Username as string
			};

			await ctx.scene.enter("Chatting");
		});

		this.bot.command("chatting", async (ctx: any) => {
			await ctx.sendMessage("Напишите Юзернейм человека(он уже должен быть быть в базе пользователей бота)", Markup.keyboard([
				Markup.button.text("Домой🏠")
			])
				.resize()
				.oneTime());

			return ctx.scene.enter("Chatting");
		});

		this.bot.action("Start_chatting", async (ctx: any) => {
			await ctx.deleteMessage(ctx.update.callback_query.message.message_id);

			await ctx.sendMessage("Напишите Юзернейм человека(он уже должен быть быть в базе пользователей бота)",  Markup.keyboard([
				Markup.button.text("Домой🏠")
			])
				.resize()
				.oneTime());

			return ctx.scene.enter("Chatting");
		});
	}
}