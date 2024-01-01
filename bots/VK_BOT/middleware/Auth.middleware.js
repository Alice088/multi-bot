import { getUser, createUser } from "../../../db/contollers/User.controller.js";

export async function authMiddleware(ctx, next) {
	if (!ctx.isOutbox && (ctx.text === "Начать" || ctx.text === "Start")) {
		const data = await getUser(ctx.senderId);

		if (data.text && !data.result) {
			await createUser(null, ctx.senderId);
		}
	}
  
	await next();
}