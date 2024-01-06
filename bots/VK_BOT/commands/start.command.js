import { getUser } from "../../../db/contollers/User.controller.js";

export function startCommand() {
	this.bot.updates.on("message_new", async (ctx, next) => {
		if ((ctx.text === "Начать" || ctx.text === "Start")) {
			ctx.session.users ? null : ctx.session.users = {};
			ctx.session.users[ctx.senderId] ? null : await creatingUser.call(this, ctx);

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

async function creatingUser(ctx) {
	ctx.session.users[ctx.senderId] ? null : ctx.session.users[ctx.senderId] = await getUser(ctx.senderId);
	const currentUser = ctx.session.users[ctx.senderId];

	const [fetchVkUser] = await this.bot.api.users.get({
		user_id: ctx.senderId
	});

	currentUser.id = fetchVkUser.id;
	currentUser.firstName = fetchVkUser.first_name;
	currentUser.lastName = fetchVkUser.lastName;
}