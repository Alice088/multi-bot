export async function homeCommand() {
	this.bot.updates.on("message_new", async (ctx, next) => {
		if (ctx.text === "домой") {
			await ctx.reply("Снова привет!", {
				keyboard: this.Keyboard.keyboard(this.Keyboard.defaultKeyboard).oneTime(), 
			});

			await ctx.send({ sticker_id: 52 });
		}
    
		await next();
	});
}