import { IBotContext } from "../Context.interface.js";

export function getUser(ctx: IBotContext) {
	return ctx.session.users[ctx.callbackQuery?.from.id ?? ctx.message?.from.id ?? "null"];
}