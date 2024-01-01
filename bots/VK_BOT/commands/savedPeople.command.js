import { getUser } from "../../../db/contollers/User.controller.js";
import { getSavedPeopleByOwnerID } from "../../../db/contollers/SavedPeople.controller.js";


export async function savedPeopleCommand() {
	this.bot.updates.on("message_new", async (ctx, next) => {
		if (ctx.text === "Ваши сохранненые люди") {
			const user = await getUser(ctx.senderId);
			const savedPeople = await getSavedPeopleByOwnerID(user.rows[0].ID);
			const arrayOfSavedPeopleButtons = [];

			if (savedPeople.result) {
				for (const people of savedPeople.rows) {
					arrayOfSavedPeopleButtons.push(
						this.Keyboard.textButton({
							label: `${people.saved_TGNAME ?? "не установлено"}:ID(${people.ID})`,
							color: "primary",
						}),
					);
				}
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