export async function subTyperMiddleware(ctx, next) {
	if (ctx.isOutbox && ctx.text?.includes("сохраненных людей")) {
		ctx.subTypes.push("savedPeopleTable");
	}

	await next();
}