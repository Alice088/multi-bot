import { Telegraf } from "telegraf";
import { IBotContext } from "../Context/Context.interface.js";

export abstract class Middleware {
	constructor(public bot: Telegraf<IBotContext>) { }

  abstract handle(): void
}