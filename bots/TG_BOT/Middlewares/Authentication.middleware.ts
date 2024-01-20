import { Telegraf } from "telegraf";
import { IBotContext } from "../Context/Context.interface.js";
import { Middleware } from "./Middleware.class.js";
import { getUserByUsername, createUser } from "../../../db/contollers/User.controller.js";
import { isUserContext } from "../Context/Users/IsUser.hook.js";
import { createUserContext } from "../Context/Users/createUser.hook.js";

export class AuthenticationMiddleware extends Middleware {
	constructor(bot: Telegraf<IBotContext>) {
		super(bot);
	}

	handle(): void {
		this.bot.use(async (ctx: IBotContext, next) => {
			if (!ctx.session?.users) {
				ctx.session = { users: {} };
			}

			if (!isUserContext(ctx)) {
				const username = `"@@${ctx.from?.username}"`;
				const user = await getUserByUsername(username ?? "*NOUSERNAME*");

				switch (user.result) {
					case false: {
						const { ownerID } = await createUser(username ?? "null", null);
						await createUserContext(ctx, ownerID);
						break;
					}	
						
					case true: {
						await createUserContext(ctx, user.rows[0].ID);
						break;
					}		
				}
			}

			return next();
		});
	}
}