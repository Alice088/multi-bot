import { Composer, Markup } from "telegraf";
import { Scene } from "./Scene.abstract.js";
import { Scenes } from "telegraf";
import { message } from "telegraf/filters";
import { getUserByUsername } from "../../../db/contollers/User.controller.js";
import { UsersSessions } from "../Session/UsersSessions.class.js";

export class ChattingScene extends Scene {
	public 		scene       ;
	protected stepHandler ;
	protected usersSessions;

	constructor(scenesName: string, usersSessions: UsersSessions) {
		super();

		this.usersSessions = usersSessions;
		this.stepHandler 	= new Composer<Scenes.WizardContext>();
		this.scene 				= new Scenes.WizardScene<Scenes.WizardContext>(scenesName, this.enterScene());
	}
	
	protected enterScene() {
		this.leaveHandler();

		return this.stepHandler.on(message("text"), async (ctx) => {
			const user = this.usersSessions.getUser(ctx.message.from.id ?? ctx.from.id);

			if (user.scenes.interlocutor) ctx.wizard.next();

			if (![ctx.message.text].includes("/chatting")) {
				const gotUser = await getUserByUsername(`"@@${ctx.message.text}"`);

				if (gotUser.result) {
					user.scenes.interlocutor = {
						ID: gotUser.rows[0].ID,
						username: gotUser.rows[0].Telegram_Username ?? gotUser.rows[0].Vkontakte_Username ?? "Username doesn't found"
					};
				} else {
					ctx.reply("Человек не найден в базе");
				}
			}
		});
	}

	// protected chatting;

	protected leaveHandler() {
		this.stepHandler.hears("Домой🏠", async (ctx) => {
			const user = this.usersSession?.users[ctx.from?.id ?? "null"];

			if (user) {
				user.scenes._firstTime 	 = 	true;
				user.scenes.interlocutor =  null;
			}

			await ctx.reply("Конец общения", Markup.removeKeyboard());

			await ctx.scene.leave();

			await ctx.reply(
				"Вот вы и снова дома, Господин",
				Markup.inlineKeyboard([
					[Markup.button.callback("Начать общение🗣", "Start_chatting")],
					[Markup.button.callback("Сохраненные люди👨‍👦‍👦", "Saved_people")],
					[Markup.button.callback("Что это такое?🧐", "Whats_this")],
				])
			);
		});
	}
}