export function firstTimeCommand() {
	this.bot.updates.on("message_new", async (ctx, next) => {
		if (ctx.text === "Я впервые пользуюсь этим ботом") {
			await ctx.reply(`
        Это opensource пет-проект человека Alice088,
        он сделан, чтобы облегчить жизнь людям которым лень заходить в вк или телеграм, чтобы написать своим друзьям,
        поэтому этот бот помогает вам общаться с друзьями через ботов, он устанавливает связь между вами с помощью
        Longpolling и очереди сообщений благодаря чему вы можете свободно общаться.
        GitHub: https://github.com/Alice088/multi-bot
      `, {
				keyboard: this.Keyboard.keyboard([this.Keyboard.homeButton]).inline()
			});
		} 
			
		await next();
	});
}