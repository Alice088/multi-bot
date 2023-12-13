export function chattingScene() {
	this.bot.updates.on("message_new", async (ctx, next) => {
		if(ctx.text === "Начать общение") {
			return ctx.scene.enter("chatting");
		} else {
			return next();
		}
	});
	
	this.sceneManager.addScenes([
		new this.StepScene("chatting", [
			(ctx) => {
				if(ctx.scene.step.firstTime || !ctx.text) {
					return ctx.send("Напишите корректное @Юзернейм человека");
				}
			}
		])
	]);
}