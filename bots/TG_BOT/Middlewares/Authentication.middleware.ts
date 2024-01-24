import { Telegraf } from "telegraf";
import { IBotContext } from "../Context/Context.interface.js";
import { Middleware } from "./Middleware.class.js";
import { getUserByUsername, createUser } from "../../../db/contollers/User.controller.js";
import { UsersSessions } from "../Session/UsersSessions.class.js";

export class AuthenticationMiddleware extends Middleware {
	constructor(private bot: Telegraf<IBotContext>, private usersSessions: UsersSessions) {
		super();
	}

	handle(): void {
		this.bot.use(async (ctx: IBotContext, next) => {
			if (!this.usersSessions.isUser(ctx.from?.id ?? 1)) {
				const username = `"@@${ctx.from?.username}"`;
				const user = await getUserByUsername(username ?? "*NOUSERNAME*");

				switch (user.result) {
					case false: {
						const { ownerID } = await createUser(username ?? "null", null);
						await this.usersSessions.createUser(ctx.from?.id, ownerID);
						break;
					}	
						
					case true: {
						await this.usersSessions.createUser(ctx.from?.id, user.rows[0].ID);
						break;
					}		
				}
			}

			return next();
		});
	}
}