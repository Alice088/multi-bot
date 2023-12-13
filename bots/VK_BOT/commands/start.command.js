import { Keyboard } from "vk-io";

export function startCommand() {
	this.bot.updates.on("message_new", async (ctx) => {
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
		if(ctx.text === "Начать поиск людей") {
			await this.bot.scene.enter("chatting");
		}
	});
}