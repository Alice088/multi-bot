import { Composer, Markup } from "telegraf";
import { Scene } from "./Scene.abstract.js";
import { Scenes } from "telegraf";
import { sessionData } from "../Context/Context.interface.js";
import { message } from "telegraf/filters";

export class ChattingScene extends Scene {
	public 		scene       ;
	protected stepHandler ;
	protected usersSession;

	constructor(scenesName: string, usersSession: sessionData | undefined) {
		super();

		this.usersSession = usersSession;
		this.stepHandler 	= new Composer<Scenes.WizardContext>();
		this.scene 				= new Scenes.WizardScene<Scenes.WizardContext>(scenesName, this.enterScene());
	}
	
	protected enterScene() {
		this.leaveHandler();

		return this.stepHandler.on(message("text"), (ctx) => {
			const user = this.usersSession?.users[ctx.from.id];

			if (user?.scenes.interlocutor) ctx.wizard.next();

			if (!ctx.message.text.startsWith("@@") && ![ctx.message.text].includes("/chatting")) {
				ctx.reply("Неккоректный @@Юзернейм человека, он должен содержать в начале строки две @@");
			}
		});
	}

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