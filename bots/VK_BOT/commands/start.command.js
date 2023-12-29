export function startCommand() {
	this.bot.updates.on("message_new", async (ctx, next) => {
		if (ctx.text === "Начать" || ctx.text === "начать") {
			const [user] = await this.bot.api.users.get({
				user_id: ctx.senderId
			});

			await ctx.reply(`Добро пожаловать в Мульти-бот, ${user.first_name}!🥳`, {
				keyboard: this.Keyboard.keyboard(this.defaultKeyboard).oneTime()
			});

			await ctx.send({ sticker_id: 50 });
		} else if(ctx.text === "Домой") {
			await ctx.reply("Снова привет!", {
				keyboard: this.Keyboard.keyboard(this.defaultKeyboard).oneTime(), 
			});
		} else {
			return next();
		}
	});
}