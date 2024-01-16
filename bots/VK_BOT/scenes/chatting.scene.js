import { asyncSetTimeout } from "../../../hooks/asyncSetTimeout.js";
import { addSavedPeople, checkDuplicateSavedPeople } from "../../../db/contollers/SavedPeople.controller.js";
import { getUserByUsername } from "../../../db/contollers/User.controller.js";
// import { messageRequest } from "../../../index.js";
// import { queueOfRequests } from "../../../index.js";

export function chattingScene() {
	this.bot.updates.on("message_new", async (ctx, next) => {
		if (ctx.text === "начать общение") {
			return ctx.scene.enter("StartChatting");
		} else {
			return next();
		}
	});
	
	this.sceneManager.addScenes([
		new this.StepScene("StartChatting", [
			async function startChatting(ctx) {
				const currentUser = this.userContext.users[ctx.senderId];
				if (currentUser.interlocutor) return ctx.scene.step.next();

				const homeButtonButton = { keyboard: this.Keyboard.keyboard([this.Keyboard.homeButton]).inline() };

				if (ctx.text === "Домой") {
					ctx.reply("конец общения", {
						keyboard: this.Keyboard.keyboard(this.Keyboard.defaultKeyboard).oneTime()
					});
					return ctx.scene.leave();
				}

				if ((ctx.scene.step.firstTime || !ctx.text)) {
					return ctx.reply("Напишите корректный @@Юзернейм человека из телеграма", homeButtonButton);
				} else if (!ctx.text.startsWith("@@")) {
					return ctx.reply("Неккоректный @@Юзернейм, он должен содержать '@@' в начале", homeButtonButton);
				}	

				ctx.scene.state.interlocutorUsername = `"${ctx.text}"`;
				return ctx.scene.step.next();
			}.bind(this),

			async function checkUsername(ctx) {
				const currentUser = this.userContext.users[ctx.senderId];
				if (currentUser.interlocutor) return ctx.scene.step.next();
				if (ctx.text === "Домой") {
					ctx.reply("конец общения", {
						keyboard: this.Keyboard.keyboard(this.Keyboard.defaultKeyboard).oneTime()
					});
					return ctx.scene.leave();
				}
				
				const interlocutor = await getUserByUsername(ctx.scene.state.interlocutorUsername);

				switch (interlocutor.result) {
				case false:
					ctx.scene.leave();
					await ctx.reply(interlocutor.text);
					await asyncSetTimeout(1000);
					await ctx.scene.enter("StartChatting");
					break;
						
				case true:
					ctx.reply("Начинаю общение!");
						
					currentUser.interlocutor = {};
					currentUser.interlocutor.username = ctx.scene.state.interlocutorUsername;
					currentUser.interlocutor.ID = interlocutor.rows[0].ID;

					if (!(await checkDuplicateSavedPeople(currentUser.rows.ID, ctx.scene.state.interlocutorUsername))) {
						await addSavedPeople(currentUser.rows.ID, interlocutor.rows[0].ID, ctx.scene.state.interlocutorUsername, null);
					}
					
					// ctx.scene.enter("Chatting");
					break;
				}
			}.bind(this)
		],
			
		new this.StepScene("Chatting", [
			
		])
		)
	]);
}