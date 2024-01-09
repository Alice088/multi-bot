import { getUser, createUser } from "../../../db/contollers/User.controller.js";

export async function authMiddleware(ctx, next) {
	const usersContext = this.userContext;

	usersContext.getUserContextById(ctx.senderId) ? null : await creatingUser.call(this, ctx);

	if (!ctx.isOutbox && (ctx.text === "начать")) {
		const fetchData = await getUser(ctx.senderId);

		if (fetchData.text && !fetchData.result) {
			await createUser(null, ctx.senderId);
		}
	}
  
	await next();
}

async function creatingUser(ctx) {
	const usersContext = this.userContext;
	const [fetchVkUser] = await this.bot.api.users.get({
		user_id: ctx.senderId
	});

	if (!usersContext.getUserContextById(ctx.senderId)) {
		usersContext[ctx.senderId] = await getUser(ctx.senderId);
	}
	const currentUser = usersContext[ctx.senderId];

	currentUser.id = fetchVkUser.id;
	currentUser.firstName = fetchVkUser.first_name;
	currentUser.lastName = fetchVkUser.lastName;
}