import { getUser } from "../../../db/contollers/User.controller.js";
import { getSavedPeopleByOwnerID } from "../../../db/contollers/SavedPeople.controller.js";
import { buttonsDividerHook } from "../../../hooks/buttonsDivider.hook.js";
import { quickParse } from "../../../hooks/quickParse.hook.js";
import { editMessageApi } from "../api/messages/editMessage.api.js";

export async function savedPeopleCommand() {
	this.bot.updates.on("message_new", async (ctx, next) => {
		const messagePayload = quickParse(ctx.payload.message.payload);

		if (ctx.text === "Ваши сохранненые люди") {
			const currentUser = ctx.session.users[ctx.senderId];

			currentUser?.rows ? null : currentUser.rows = await getUser(ctx.senderId);
			currentUser.savedPeople = await getSavedPeopleByOwnerID(currentUser.rows[0].ID);
			currentUser.currentPage = 0;
			currentUser.currentTable = 0;
			
			const viewModel = await createArrayOfSavedPeopleView.call(this, currentUser.savedPeople, currentUser.currentPage, currentUser);
			
			await ctx.reply(`Найдено ${viewModel.countPeople} сохраненных людей, страница ${currentUser.currentPage + 1} из ${currentUser.lengthOfPages}:`, {
				keyboard: this.Keyboard.keyboard(viewModel.buttons).inline(),
			});
		} else if (messagePayload.type === "pageNavigation") {
			const currentUser = ctx.session.users[ctx.senderId];
			
			messagePayload.direction === "Left" ? currentUser.currentPage-- : currentUser.currentPage++;

			const viewModel = await createArrayOfSavedPeopleView.call(this, currentUser.savedPeople, currentUser.currentPage, currentUser);
			
			await editMessageApi({
				message: `Найдено ${viewModel.countPeople} сохраненных людей, страница ${currentUser.currentPage + 1} из ${currentUser.lengthOfPages}:`,
				conversation_message_id: currentUser.currentTable.message_id,
				peer_id: currentUser.currentTable.peer,
				keyboard: this.Keyboard.keyboard(viewModel.buttons).inline(),
				v: 5.199
			});
		}
		
		if (ctx.is(["savedPeopleTable"])) {
			ctx.session.users[ctx.senderId].currentTable = { message_id: ctx.conversationMessageId, peer: ctx.peerId };
		}

		await next();
	});
}

async function createArrayOfSavedPeopleView(savedPeople, currentPage, currentUser) {
	const pages = buttonsDividerHook(savedPeople.rows);
	const arrayOfSavedPeopleButtons = [];

	creatingButtonsList.call(this, savedPeople.result, arrayOfSavedPeopleButtons, pages, savedPeople.text, currentPage, currentUser);
	creatingNavigationButtons.call(this, arrayOfSavedPeopleButtons, pages, currentPage);

	return {
		buttons: arrayOfSavedPeopleButtons,
		countPeople: savedPeople.rows.length
	};
}

function creatingButtonsList(resultOfFetchData, parentArray, pages, errorText, currentPage, currentUser) {
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

	currentUser.lengthOfPages = pages.length;
}

function creatingNavigationButtons(parentArray, pages, currentPage) {
	if (pages.length <= 3) {
		return; 
	} else if (currentPage === 0) {
		parentArray.push([this.Keyboard.rightArrow({ direction: "Right", type: "pageNavigation" })]);
	} else if ((currentPage + 1) === pages.length) {
		parentArray.push([this.Keyboard.leftArrow({ direction: "Left", type: "pageNavigation" })]);
	} else {
		parentArray.push([
			this.Keyboard.leftArrow({ direction: "Left", type: "pageNavigation" }),
			this.Keyboard.rightArrow({ direction: "Right", type: "pageNavigation" })
		]);
	}

	parentArray.push(this.Keyboard.homeButton);
}