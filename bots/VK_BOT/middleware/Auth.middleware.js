import { getUser, createUser } from "../../../db/contollers/User.controller.js";

export async function authMiddleware(ctx, next) {
	if (!ctx.isOutbox && (ctx.text === "Начать" || ctx.text === "Start")) {
		const fetchData = await getUser(ctx.senderId);

		if (fetchData.text && !fetchData.result) {
			await createUser(null, ctx.senderId);
		}

		ctx.session.users ? null : ctx.session.users = {};
		ctx.session.users[ctx.senderId] ? null : await creatingUser.call(this, ctx);
	}
  
	await next();
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