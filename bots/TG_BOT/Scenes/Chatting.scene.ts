/* eslint-disable @typescript-eslint/no-explicit-any */
import { Composer, Markup } from "telegraf";
import { Scene } from "./Scene.abstract.js";
import { Scenes } from "telegraf";
import { getUserByUsername } from "../../../db/contollers/User.controller.js";
import { UsersSessions } from "../Session/UsersSessions.class.js";
import { messageRequest } from "../../../index.js";
import { queueOfRequests } from "../../../index.js";
import { ContextDefaultState, MessageContext } from "vk-io";
import { User } from "../User/type/User.type.js";
import { addSavedPeople } from "../../../db/contollers/SavedPeople.controller.js";

export class ChattingScene extends Scene {
	public 		scene        ;
	protected stepHandler  ;
	protected usersSessions;

	constructor(scenesName: string, usersSessions: UsersSessions) {
		super()	;

		this.usersSessions = usersSessions																														 											;
		this.stepHandler 	 = new Composer<Scenes.WizardContext>()																									  				;
		this.scene 				 = new Scenes.WizardScene<Scenes.WizardContext>(scenesName, this.enterStep())											;
	}
	
	protected enterStep() {
		this.leaveHandler();

		return this.stepHandler.use(async (ctx: any, next) => {
			const user = this.usersSessions.getUser(ctx.update?.callback_query?.from.id ?? ctx?.from?.id ?? ctx?.message?.from.id);

			if (user.scenes.interlocutor) {
				await ctx.reply(
					`Ожидание собеседника ${user.scenes.interlocutor.username}.... \n(вы уже можете писать сообщения, они отправятся в очередь сообщений)`,
					Markup.keyboard([
						Markup.button.text("Домой🏠")
					]).resize()
						.oneTime()
				);

				return this.chattingStep(ctx, user);
			} else if (![ctx?.message?.text].includes("/chatting")) {
				const gotUser = await getUserByUsername(`"@@${ctx.update.message.text}"`);

				if (gotUser.result) {
					user.scenes.interlocutor = {
						ID: gotUser.rows[0].ID,
						username: gotUser.rows[0].Telegram_Username ?? gotUser.rows[0].Vkontakte_Username ?? "Username doesn't found"
					};

					await addSavedPeople(user.rowID, gotUser.rows[0].ID, gotUser.rows[0].Telegram_Username, gotUser.rows[0].Vkontakte_Username);

					user.scenes._firstTime = true;

					await ctx.reply(
						`Ожидание собеседника ${user.scenes.interlocutor.username}.... \n(вы уже можете писать сообщения, они отправятся в очередь сообщений)`
					);

					return this.chattingStep(ctx, user);
				} else {
					return ctx.reply("Человек не найден в базе");
				}
			}

			return next();
		}).middleware();
	}

	protected async chattingStep(ctx: any, user: User) {	
		if (user.scenes.firstTime) {
			queueOfRequests.addInQueue(
				user.scenes?.interlocutor?.ID ?? 1,
				messageRequest.createMessageRequest({
					text: "Ожидание собеседника окончено, ваш собеседник: " + ctx.from?.username + "!",
				} as MessageContext<ContextDefaultState>, user.rowID)
			);

			user.scenes.clearCheckMSGInterlocutorInterval = setInterval(() => {
				const messageRequest = queueOfRequests.getOneFromQueue(user.rowID, user.scenes?.interlocutor?.ID ?? 1);

				if (messageRequest) {
					for (const message of messageRequest.messages) {
						ctx.reply(message);
					}
				}

				queueOfRequests.deleteAllRequestFromOneUserForOneUser(user.rowID, user.scenes.interlocutor?.ID ?? 1);
			}, 2000);

			return;
		}

		if ((![ctx.message.text].includes("/chatting") || ![ctx.message.text].includes("Домой🏠"))) {
			queueOfRequests.addInQueue(
				user.scenes?.interlocutor?.ID ?? 1,
				messageRequest.createMessageRequest({
					text: ctx.message.text
				} as MessageContext<ContextDefaultState>, user.rowID)
			);
		}
	}

	protected leaveHandler() {
		this.stepHandler.hears("Домой🏠", async (ctx) => {
			const user = this.usersSessions.getUser(ctx.message.from.id ?? ctx.from.id);

			queueOfRequests.addInQueue(
				user.scenes?.interlocutor?.ID ?? 1,
				messageRequest.createMessageRequest({
					text: `Собеседник ${ctx.from?.username} закончил общение с вами!`,
				} as MessageContext<ContextDefaultState>, user.rowID)
			);

			queueOfRequests.deleteAllRequestFromOneUserForOneUser(user.rowID, user.scenes.interlocutor?.ID ?? 1);

			if (user) {
				clearInterval(user.scenes.clearCheckInterlocutorInterval);
				clearInterval(user.scenes.clearCheckMSGInterlocutorInterval);
				user.scenes._firstTime 												= true		 ;
				user.scenes.interlocutor 											= null		 ;
				user.scenes.clearCheckMSGInterlocutorInterval = undefined;
				user.scenes.clearCheckInterlocutorInterval 		= undefined;
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