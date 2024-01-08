export async function subTyperMiddleware(ctx, next) {
	if (ctx.isOutbox && ctx.text?.includes("Ваши сохраненные люди")) {
		ctx.subTypes.push("savedPeopleTable");
	}

	await next();
}