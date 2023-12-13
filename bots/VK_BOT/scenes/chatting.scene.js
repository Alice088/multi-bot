export function chattingScene() {
	this.bot.updates.on("message_new", (ctx) => {
		if(ctx.text === "Начать поиск людей") {
			return this.bot.scene.enter("chatting");
		}	
	});

	this.sceneManager.addScenes([
		new this.StepScene("chatting", [
			(ctx) => {
				if(ctx.scene.step.firstTime || !ctx.text) {
					return ctx.send("Напишите корректное @телеграмАйди человека");
				}
			}
		])
	]);
}