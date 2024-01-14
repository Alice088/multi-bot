import { addSavedPeople } from "../../../db/contollers/SavedPeople.controller.js";
import { messageRequest } from "../../../index.js";
import { queueOfRequests } from "../../../index.js";

export function chattingScene() {
	this.bot.updates.on("message_new", async (ctx, next) => {
		if (ctx.text === "начать общение") {
			return ctx.scene.enter("Chatting");
		} else {
			return next();
		}
	});
	
	this.sceneManager.addScenes([
		new this.StepScene("Chatting", [
			async function startChatting(ctx) {
				const currentUser = this.userContext.users[ctx.senderId];

				if (currentUser.targetUser) return ctx.scene.step.next();
				else if (ctx.text === "Домой") {
					ctx.reply("конец общения", {
						keyboard: this.Keyboard.keyboard(this.Keyboard.defaultKeyboard).oneTime()
					});
					return ctx.scene.leave();
				}

				if ((ctx.scene.step.firstTime || !ctx.text)) {
					return ctx.reply("Напишите корректный @@Юзернейм человека из телеграма", {
						keyboard: this.Keyboard.keyboard([this.Keyboard.homeButton]).inline()
					});
				} else if (!ctx.text.startsWith("@@")) {
					return ctx.reply("Неккоректный @@Юзернейм, он должен содержать '@@' в начале", {
						keyboard: this.Keyboard.keyboard([this.Keyboard.homeButton]).inline()
					});
				}	

				currentUser.targetUser = ctx.text;
				await addSavedPeople(currentUser.rows.ID, null, ctx.text, null, null);

				return ctx.scene.step.next();
			}.bind(this),

			async function chatting(ctx) {
				// if ((ctx.scene.step.firstTime || !ctx.text)) {
				// 	return ctx.reply("пишите", {
				// 		keyboard: this.Keyboard.keyboard([this.Keyboard.homeButton]).inline()
				// 	});
				// } else {
				// 	queueOfRequests.addInQueue()
				// }
			}.bind(this)
		])
	]);
}