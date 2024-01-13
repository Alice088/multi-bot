import { getUser, createUser } from "../../../db/contollers/User.controller.js";

export async function authMiddleware(ctx, next) {
	if (!this.userContext.getUserContextById(ctx.senderId)) {
		const fetchData = await getUser(ctx.senderId);

		this.userContext.users[ctx.senderId] = {};

		if (fetchData.text && !fetchData.result) {
			await createUser(null, ctx.senderId);
			const newUser = await getUser(ctx.senderId);

			this.userContext.users[ctx.senderId].rows = newUser.rows[0];
			await creatingUserContext.call(this, ctx);
		} else {
			this.userContext.users[ctx.senderId].rows = fetchData.rows[0];
			await creatingUserContext.call(this, ctx);
		}
	}

	await next();
}

async function creatingUserContext(ctx) {
	const currentUser = this.userContext.users[ctx.senderId];
	const [fetchVkUser] = await this.bot.api.users.get({
		user_id: ctx.senderId
	});

	currentUser.id = fetchVkUser.id;
	currentUser.firstName = fetchVkUser.first_name;
	currentUser.lastName = fetchVkUser.lastName;
}