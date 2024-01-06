import { getUser } from "../../../db/contollers/User.controller.js";
import { getSavedPeopleByOwnerID } from "../../../db/contollers/SavedPeople.controller.js";
import { buttonsDividerHook } from "../../../hooks/buttonsDivider.hook.js";
import { quickParse } from "../../../hooks/quickParse.hook.js";

export async function savedPeopleCommand() {
	this.bot.updates.on("message_new", async (ctx, next) => {
		const messagePayload = quickParse(ctx.payload.message.payload);

		if (ctx.text === "Ваши сохранненые люди") {
			const currentUser = ctx.session.users[ctx.senderId];

			currentUser?.rows ? null : currentUser.rows = await getUser(ctx.senderId);
			currentUser.savedPeople = await getSavedPeopleByOwnerID(currentUser.rows[0].ID);
			currentUser.currentPage = 0;
			
			const viewModel = await createArrayOfSavedPeopleView.call(this, currentUser.savedPeople, currentUser.currentPage);
			
			await ctx.reply(`Ваши сохраненные люди(${viewModel.countPeople}):`, {
				keyboard: this.Keyboard.keyboard(viewModel.buttons).inline(),
			});
		} else if (messagePayload.type === "pageNavigation") {
			const currentUser = ctx.session.users[ctx.senderId];
			
			messagePayload.direction === "Left" ? --currentUser.currentPage : ++currentUser.currentPage;

			const viewModel = await createArrayOfSavedPeopleView.call(this, currentUser.savedPeople, currentUser.currentPage);
			
			await this.bot.api.messages.edit({
				message: `Ваши сохраненные люди(${viewModel.countPeople}):`,
				message_id: ctx.id,
				peer_id: ctx.peerId,
				keyboard: this.Keyboard.keyboard(viewModel.buttons).inline()
			});
		}

		await next();
	});
}

async function createArrayOfSavedPeopleView(savedPeople, currentPage) {
	const pages = buttonsDividerHook(savedPeople.rows);
	const arrayOfSavedPeopleButtons = [];

	creatingButtonsList.call(this, savedPeople.result, arrayOfSavedPeopleButtons, pages, savedPeople.text, currentPage);
	creatingNavigationButtons.call(this, arrayOfSavedPeopleButtons, pages);

	return {
		buttons: arrayOfSavedPeopleButtons,
		countPeople: savedPeople.rows.length
	};
}

function creatingButtonsList(resultOfFetchData, parentArray, pages, errorText, currentPage) {
	if (resultOfFetchData) {
		for (const people of pages.at(currentPage)) {
			parentArray.push(
				this.Keyboard.textButton({
					label: `${people.saved_TGNAME ?? "не установлено"}:ID(${people.ID})`,
					color: "primary",
				}),
			);
		}
	} else {
		parentArray.push(
			this.Keyboard.textButton({
				label: errorText,
				color: "primary",
			}),
		);
	}

	parentArray.push(this.Keyboard.homeButton);
}

function creatingNavigationButtons(parentArray, pages) {
	if (!(pages.length <= 3) && pages === 0) {
		parentArray.push([this.Keyboard.rightArrow({ direction: "Right", type: "pageNavigation" })]);
	} else if (!(pages.length <= 3) && pages === pages.length) {
		parentArray.push([this.Keyboard.leftArrow({ direction: "Left", type: "pageNavigation" })]);
	} else {
		parentArray.push([
			this.Keyboard.leftArrow({ direction: "Left", type: "pageNavigation" }),
			this.Keyboard.rightArrow({ direction: "Right", type: "pageNavigation" })
		]);
	}
}