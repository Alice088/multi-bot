export async function homeCommand() {
	this.bot.updates.on("message_new", async (ctx, next) => {
		if (ctx.text === "Домой") {
			await ctx.reply("Снова привет!", {
				keyboard: this.Keyboard.keyboard(this.Keyboard.defaultKeyboard).oneTime(), 
			});
		}
    
		await next();
	});
}