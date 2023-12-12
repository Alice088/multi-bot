import { Keyboard } from "vk-io";

export class StartCommand {
	bot;
	
	constructor(bot) {
		this.bot = bot;
	}

	handle() {
		this.bot.updates.on("message", async (ctx) => {
			if(ctx.text === "Начать" || ctx.text ===  "начать") {
				await ctx.reply("Добро пожаловать в Мульти-бот!🥳", {
					keyboard: Keyboard.keyboard([
						Keyboard.textButton({
							label: "Начать поиск людей",
							color: "positive",
						}),

						Keyboard.textButton({
							label: "Ваши сохранненые люди",
							color: "primary",
						})
					]).oneTime()
				});
				await ctx.send({ sticker_id: 50 });
			}
		});
	}
}