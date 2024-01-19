import { getUserByUsername, createUser, getUserByID } from "../../../dist/db/contollers/User.controller.js";

export async function authMiddleware(ctx, next) {
	if (!this.userContext.getUserContextById(ctx.senderId)) {
		const [fetchVkUser] = await this.bot.api.users.get({
			user_ids: ctx.senderId,
			fields: [
				"screen_name"
			]
		});

		const fetchData = await getUserByUsername(`"@@${fetchVkUser.screen_name}"`);

		if (fetchData.text && !fetchData.result) {
			const { ownerID } = await createUser(null, `"@@${fetchVkUser.screen_name}"`);
			const newUser = await getUserByID(ownerID);

			this.userContext.users[ctx.senderId].rows = newUser.rows[0];
			await creatingUserContext.call(this, ctx, fetchVkUser);
		} else {
			this.userContext.users[ctx.senderId].rows = fetchData.rows[0];
			await creatingUserContext.call(this, ctx, fetchVkUser);
		}
	}

	await next();
}

async function creatingUserContext(ctx, fetchVkUser) {
	const currentUser = this.userContext.users[ctx.senderId];

	currentUser.id = fetchVkUser.id;
	currentUser.firstName = fetchVkUser.first_name;
	currentUser.lastName = fetchVkUser.lastName;
}