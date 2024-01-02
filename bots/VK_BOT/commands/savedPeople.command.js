import { getUser } from "../../../db/contollers/User.controller.js";
import { getSavedPeopleByOwnerID } from "../../../db/contollers/SavedPeople.controller.js";
import { buttonsDividerHook } from "../../../hooks/buttonsDivider.hook.js";
import { quickParse } from "../../../hooks/quickParse.hook.js";

export async function savedPeopleCommand() {
	this.bot.updates.on("message_new", async (ctx, next) => {
		const messagePayload = quickParse(ctx.payload.message.payload);

		if (ctx.text === "Ваши сохранненые люди") {
			ctx.session.page = 0;
			const viewModel = await createArrayOfSavedPeopleView.call(this, ctx);

			await ctx.reply(`Ваши сохраненные люди(${viewModel.countPeople}):`, {
				keyboard: this.Keyboard.keyboard(viewModel.buttons).inline(),
			});
		} else if (messagePayload.type === "pageNavigation") {
			const viewModel = await createArrayOfSavedPeopleView.call(this, ctx);
			messagePayload.direction === "Left" ? --ctx.session.page : ++ctx.session.page;

			await this.bot.api.messages.edit({
				message: `Ваши сохраненные люди(${viewModel.countPeople}):`,
				conversation_message_id: ctx.conversationMessageId,
				peer_id: -223734402,
				group_id: -223734402,
				keyboard: this.Keyboard.keyboard(viewModel.buttons).inline()
			});
		}

		await next();
	});
}

async function createArrayOfSavedPeopleView(ctx) {
	const user = await getUser(ctx.senderId);
	const savedPeople = await getSavedPeopleByOwnerID(user.rows[0].ID);
	const pages = buttonsDividerHook(savedPeople.rows);
	const arrayOfSavedPeopleButtons = [];

	if (savedPeople.result) {
		for (const people of pages.at(ctx.session.page)) {
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

	if (!(pages.length <= 3) && ctx.session.page === 0) {
		arrayOfSavedPeopleButtons.push([this.Keyboard.rightArrow({ direction: "Right", type: "pageNavigation" })]);
	} else if (!(pages.length <= 3) && ctx.session.page === pages.length) {
		arrayOfSavedPeopleButtons.push([this.Keyboard.leftArrow({ direction: "Left" , type: "pageNavigation"})]);
	} else {
		arrayOfSavedPeopleButtons.push([
			this.Keyboard.leftArrow({ direction: "Left" , type: "pageNavigation"}),
			this.Keyboard.rightArrow({ direction: "Right", type: "pageNavigation" })
		]);
	}

	return {
		buttons: arrayOfSavedPeopleButtons,
		countPeople: savedPeople.rows.length
	};
}