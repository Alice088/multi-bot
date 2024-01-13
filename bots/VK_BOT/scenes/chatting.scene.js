import { addSavedPeople } from "../../../db/contollers/SavedPeople.controller.js";

export function chattingScene() {
	this.bot.updates.on("message_new", async (ctx, next) => {
		if (ctx.text === "начать общение") {
			return ctx.scene.enter("startChatting");
		} else {
			return next();
		}
	});
	
	this.sceneManager.addScenes([
		new this.StepScene("startChatting", [
			async function startChatting (ctx) {
				const currentUser = this.userContext.users[ctx.senderId];

				if (currentUser.targetUser) return ctx.scene.step.next();

				if ((ctx.scene.step.firstTime || !ctx.text)) {
					return ctx.reply("Напишите корректный @@Юзернейм человека из телеграма", {
						keyboard: this.Keyboard.keyboard([this.Keyboard.homeButton]).inline()
					});
				} else if (!ctx.text.startsWith("@@")) {
					return ctx.send("Неккоректный @@Юзернейм, он должен содержать '@@' в начале");
				}	

				currentUser.targetUser = ctx.text;
				await addSavedPeople(currentUser.rows.ID, null, ctx.text, null, null);

				return ctx.scene.step.next();
			}.bind(this),
			(ctx) => {
				console.log(ctx, "next scene");
			}
		])
	]);
}