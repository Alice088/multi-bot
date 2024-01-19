import { IBotContext } from "../Context.interface.js";

export function isUserContext(ctx: IBotContext): boolean {
	return !!(ctx.session.users[ctx.from?.id ?? "null"]);
}