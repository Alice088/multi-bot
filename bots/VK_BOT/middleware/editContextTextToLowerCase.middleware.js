export async function editContextTextToLowerCaseMiddleware(ctx, next) {
	if (!ctx.isOutbox) ctx.text = ctx.text?.toLowerCase();
	
	await next();
}