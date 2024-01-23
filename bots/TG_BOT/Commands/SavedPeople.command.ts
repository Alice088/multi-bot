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
			user.savedPeople.currentPage = 0;
			
			const createdButtons = createButtons(user);
			const buttonsLayout = createButtonsLayout(createdButtons, user);

			const gotSavedPeople = await getSavedPeopleByOwnerID(user.rowID);
			user.savedPeople.rows = gotSavedPeople.rows;
			user.savedPeople.result = gotSavedPeople.result;
			user.savedPeople.text = gotSavedPeople.text;

			user.savedPeople.savedPeopleButtons = createdButtons;

			ctx.editMessageText(`
				страница ${user.savedPeople.currentPage + 1} из ${createdButtons.pagesLength}.
				Найдено ${user.savedPeople.rows.length} людей:

			`, Markup.inlineKeyboard([...buttonsLayout]));
		});

		this.bot.command("people", async (ctx) => {
			const user = getUser(ctx);
			user.savedPeople.currentPage = 0;

			const createdButtons = createButtons(user);
			const buttonsLayout = createButtonsLayout(createdButtons, user);

			const gotSavedPeople = await getSavedPeopleByOwnerID(user.rowID);
			user.savedPeople.rows = gotSavedPeople.rows;
			user.savedPeople.result = gotSavedPeople.result;
			user.savedPeople.text = gotSavedPeople.text;

			user.savedPeople.savedPeopleButtons = createdButtons;

			ctx.reply(`
				страница ${user.savedPeople.currentPage + 1} из ${createdButtons.pagesLength}.
				Найдено ${user.savedPeople.rows.length} людей:

			`, Markup.inlineKeyboard([...buttonsLayout]));
		});

		this.bot.action(/.*Saved_people_navigation.*/, async (ctx) => {
			const user = getUser(ctx);
			const direction = ctx.match[0].split("_").includes("left");
			const hasUserNewPeople = user.savedPeople.savedPeopleButtons?.buttons.length === user.savedPeople.rows.length;
			let buttonsLayout;

			direction ? --user.savedPeople.currentPage : ++user.savedPeople.currentPage;

			if (hasUserNewPeople) {
				buttonsLayout = createButtonsLayout(user.savedPeople.savedPeopleButtons, user);
			} else {
				const createdButtons = createButtons(user);
				buttonsLayout = createButtonsLayout(createdButtons, user);
				user.savedPeople.savedPeopleButtons = createdButtons;
			}

			ctx.editMessageText(`
				страница ${user.savedPeople.currentPage + 1} из ${user.savedPeople.savedPeopleButtons?.pagesLength ?? 1}.
				Найдено ${user.savedPeople.rows.length} людей:

			`, Markup.inlineKeyboard([...buttonsLayout]));
		});
	}
}

export function createButtons(user: User) {
	const arrayOfButtons = [];
	const pages = buttonsDividerHook(user.savedPeople.rows);
	
	if (user.savedPeople.result) {
		for (const people of pages.at(user.savedPeople.currentPage)) {
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
				user.savedPeople.text as string,
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
	
	if (user.savedPeople.result) {
		switch (true) {
			case createdButtons?.pagesLength === 1:
				buttonsLayout.push([stopButton, stopButton]);
				break;

			case user.savedPeople.currentPage === 0:
				buttonsLayout.push([stopButton, buttonToRight]);
				break;

			case (user.savedPeople.currentPage + 1) === createdButtons?.pagesLength:
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