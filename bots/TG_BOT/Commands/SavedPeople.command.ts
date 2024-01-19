import { Markup, Telegraf } from "telegraf";
import { Command } from "./Commad.class.js";
import { IBotContext } from "../Context/Context.interface.js";

export class SavedPeopleCommand extends Command {
	constructor(bot: Telegraf<IBotContext>) {
		super(bot);
	}

	handle(): void {
		this.bot.action("Saved_people", (ctx) => {
			// ctx.editMessageText();      
		});
	}
}