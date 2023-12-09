// import { bot } from "./Bot.config.js";
// import { stickers } from "./stickers/mapStickers.js";
// import { botController } from "./Bot.contoller.js";
//
// const asynSetTimeout = async (time) => {
// 	await new Promise(resolve => setTimeout(resolve, time));
// };
//
// export const botController = {
// 	async onWelcome(msg) {
// 		bot.removeTextListener(botController.onWelcome);
//
// 		await bot.sendMessage(msg.chat.id, "Добро пожаловать в Мульти-Бот! 👋🏻")
// 			.catch(() => {
// 				console.log("Error!");
// 			});
//
// 		await asynSetTimeout(1000);
//
// 		await bot.sendSticker(msg.chat.id, stickers.get("cute-kitty"))
// 			.catch(() => {
// 				console.log("Error!");
// 			});
// 	},
//
// 	async onInfo(msg) {
// 		await bot.sendMessage(msg.chat.id,
// 			"Это бот который позволяет общаться с людьми сквозь телеграм и вк" +
// 			"этот бот существует потому что мне лень заходить в вк чтобы писать им" +
// 			"поэтому я создал мульти бот чтобы они и я могли писать в бота и общаться" +
// 			"внезависимости где они находятся."
// 		).catch(err => {
// 			console.log("Error!", err);
// 		});
// 	}
// };