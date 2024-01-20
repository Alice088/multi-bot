import { IBotContext } from "../Context.interface.js";

export function isUserContext(ctx: IBotContext): boolean {
	return !!(ctx.session.users[ctx.callbackQuery?.from.id ?? ctx.message?.from.id ?? "null"]);
}