import { getUser } from "../../../db/contollers/User.controller.js";
import { getSavedPeopleByOwnerID } from "../../../db/contollers/SavedPeople.controller.js";
import { buttonsDividerHook } from "../../../hooks/buttonsDivider.hook.js";

export async function savedPeopleCommand() {
	this.bot.updates.on("message_new", async (ctx, next) => {
		if (ctx.text === "Ваши сохранненые люди") {
			const user = await getUser(ctx.senderId);
			const savedPeople = await getSavedPeopleByOwnerID(user.rows[0].ID);
			const arrayOfSavedPeopleButtons = [];

			if (savedPeople.result) {
				createArrayOfSavedPeopleButtons.call(this, 0, savedPeople.rows, arrayOfSavedPeopleButtons);
			} else {
				arrayOfSavedPeopleButtons.push(
					this.Keyboard.textButton({
						label: savedPeople.text,
						color: "primary",
					}),
				);
			}
      
			arrayOfSavedPeopleButtons.push(this.Keyboard.homeButton);

			await ctx.reply(`Ваши сохраненные люди(${savedPeople.rows.length}):`, {
				keyboard: this.Keyboard.keyboard(arrayOfSavedPeopleButtons).inline(),
			});
		}

		await next();
	});
}

function createArrayOfSavedPeopleButtons(currentPage, array, parentArray) {
	const pages = buttonsDividerHook(array);

	for (const people of pages[currentPage]) {
		parentArray.push(
			this.Keyboard.textButton({
				label: `${people.saved_TGNAME ?? "не установлено"}:ID(${people.ID})`,
				color: "primary",
			}),
		);
	}

	if (!(pages.length <= 3) && currentPage === 0) {
		parentArray.push([this.Keyboard.rightArrow({ command: "Right" })]);
	} else if (!(pages.length <= 3) && currentPage === pages.length) {
		parentArray.push([this.Keyboard.leftArrow({ command: "Left" })]);
	} else {
		parentArray.push([
			this.Keyboard.leftArrow({ command: "Left" }),
			this.Keyboard.rightArrow({ command: "Right" })
		]);
	}

	return pages;
}