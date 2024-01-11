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
			async (ctx) => {
				const currentUser = this.userContext[ctx.senderId];

				if (currentUser.targetUser) {
					return ctx.scene.step.next();
				} else if ((ctx.scene.step.firstTime || !ctx.text)) {
					return ctx.send("Напишите корректное @Юзернейм человека из телеграма");
				}

				currentUser.targetUser = ctx.text;
				await addSavedPeople(ctx.senderId, null, ctx.text, null, null);

				return ctx.scene.step.next();
			},
			async (ctx) => {
				console.log(ctx, "next scene");
			}
		])
	]);
}