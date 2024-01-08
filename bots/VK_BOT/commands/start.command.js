export function startCommand() {
	this.bot.updates.on("message_new", async (ctx, next) => {
		if ((ctx.text === "Начать" || ctx.text === "Start")) {
			const currentUser = ctx.session.users[ctx.senderId];

			await ctx.reply(
				ctx.senderId === 256897781
					? "Богдан, ты лошара"
					: `Добро пожаловать в Мульти-бот, ${currentUser.firstName}!🥳`, {
					keyboard: this.Keyboard.keyboard(this.Keyboard.defaultKeyboard).oneTime()
				});

			await ctx.send({ sticker_id: 50 });
		}
		
		return next();
	});
}