import { Markup, Telegraf } from "telegraf";
import { Command } from "./Commad.class.js";
import { IBotContext } from "../Context/Context.interface.js";
import { User } from "../User/type/User.type.js";
import { getUser } from "../Context/Users/getUser.hook.js";
import { buttonsDividerHook } from "../../../hooks/buttonsDivider.hook.js";
import { getSavedPeopleByOwnerID } from "../../../db/contollers/SavedPeople.controller.js";

export class SavedPeopleCommand extends Command {
	constructor(bot: Telegraf<IBotContext>) {
		super(bot);
	}

	handle(): void {
		this.bot.action("Saved_people", async (ctx) => {
			const user = getUser(ctx);
			user.currentPage = 0;
			
			const createdButtons = createButtons(user);
			const buttonsLayout = createButtonsLayout(createdButtons, user);
			
			user.saved_people = await getSavedPeopleByOwnerID(user.row_id);
			user.savedPeopleButtons = createdButtons;

			ctx.editMessageText(`
				страница ${user.currentPage + 1} из ${createdButtons.pagesLength}.
				Найдено ${user.saved_people.rows.length} людей:

			`, Markup.inlineKeyboard([...buttonsLayout]));
		});

		this.bot.command("people", async (ctx) => {
			const user = getUser(ctx);
			user.currentPage = 0;

			const createdButtons = createButtons(user);
			const buttonsLayout = createButtonsLayout(createdButtons, user);

			user.saved_people = await getSavedPeopleByOwnerID(user.row_id);
			user.savedPeopleButtons = createdButtons;

			ctx.reply(`
				страница ${user.currentPage + 1} из ${createdButtons.pagesLength}.
				Найдено ${user.saved_people.rows.length} людей:

			`, Markup.inlineKeyboard([...buttonsLayout]));
		});

		this.bot.action(/.*Saved_people_navigation.*/, async (ctx) => {
			const user = getUser(ctx);
			const direction = ctx.match[0].split("_").includes("left");
			const hasUserNewPeople = user.savedPeopleButtons?.buttons.length === user.saved_people.rows.length;
			let buttonsLayout;

			direction ? --user.currentPage : ++user.currentPage;

			if (hasUserNewPeople) {
				buttonsLayout = createButtonsLayout(user.savedPeopleButtons, user);
			} else {
				const createdButtons = createButtons(user);
				buttonsLayout = createButtonsLayout(createdButtons, user);
				user.savedPeopleButtons = createdButtons;
			}

			ctx.editMessageText(`
				страница ${user.currentPage + 1} из ${user.savedPeopleButtons?.pagesLength ?? 1}.
				Найдено ${user.saved_people.rows.length} людей:

			`, Markup.inlineKeyboard([...buttonsLayout]));
		});
	}
}

export function createButtons(user: User) {
	const arrayOfButtons = [];
	const pages = buttonsDividerHook(user.saved_people.rows);
	
	if (user.saved_people.result) {
		for (const people of pages.at(user.currentPage)) {
			arrayOfButtons.push(
				Markup.button.callback(
					`${people.Saved_Telegram_Username ?? people.Saved_Vkontakte_Username ?? "⛔"}`,
					"Save_people"
				)
			);
		}
	} else {
		arrayOfButtons.push(
			Markup.button.callback(
				user.saved_people.text as string,
				"None"
			)
		);
	}

	return {
		pagesLength: pages.length,
		buttons: arrayOfButtons
	};
}

function createButtonsLayout(createdButtons: ReturnType<typeof createButtons> | null, user: User) {
	const buttonsLayout = [];
	const stopButton = Markup.button.callback("⛔", "none");
	const buttonToLeft = Markup.button.callback("⬅️", "Saved_people_navigation_left");
	const buttonToRight = Markup.button.callback("➡️", "Saved_people_navigation_right");

	for (const button of createdButtons?.buttons ?? []) {
		buttonsLayout.push([button]);
	}
	
	if (user.saved_people.result) {
		switch (true) {
			case createdButtons?.pagesLength === 1:
				buttonsLayout.push([stopButton, stopButton]);
				break;

			case user.currentPage === 0:
				buttonsLayout.push([stopButton, buttonToRight]);
				break;

			case (user.currentPage + 1) === createdButtons?.pagesLength:
				buttonsLayout.push([buttonToLeft, stopButton]);
				break;

			default: {
				buttonsLayout.push([buttonToLeft, buttonToRight]);
			}
		}
	}

	buttonsLayout.push([Markup.button.callback("Домой🏠", "back_to_home")]);

	return buttonsLayout;
}