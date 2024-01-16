import { getSavedPeopleByOwnerID } from "../../../db/contollers/SavedPeople.controller.js";
import { buttonsDividerHook } from "../../../hooks/buttonsDivider.hook.js";
import { editMessageApi } from "../api/messages/editMessage.api.js";
import { asyncSetTimeout } from "../../../hooks/asyncSetTimeout.js";

export async function savedPeopleCommand() {
	this.bot.updates.on("message_new", async (ctx, next) => {
		if (ctx.text === "ваши сохранненые люди") {
			const currentUser = this.userContext.users[ctx.senderId];

			currentUser.savedPeople = await getSavedPeopleByOwnerID(currentUser.rows.ID);
			currentUser.currentPageIndex = 0;
			currentUser.currentTableIndex = 0;
			
			const viewModel = await createArrayOfSavedPeopleView.call(this, currentUser.savedPeople, currentUser.currentPageIndex, currentUser);
			
			const message = await ctx.reply(
				`Найдено ${viewModel.countPeople} сохраненных людей ${currentUser.lengthOfPages ? `, страница ${currentUser.currentPageIndex + 1} из ${currentUser.lengthOfPages}:` : ""}`, {
					keyboard: this.Keyboard.keyboard(viewModel.buttons).inline(),
				});
			
			this.userContext.users[ctx.senderId].currentTable = { message_id: message.conversationMessageId, peer: message.peerId };
		} 

		await next();
	});


	this.bot.updates.on("message_event", async (ctx, next) => {
		if (ctx.eventPayload.type === "pageNavigation") {
			const currentUser = this.userContext.users[ctx.userId];
			
			ctx.eventPayload.direction === "Left" ? currentUser.currentPageIndex-- : currentUser.currentPageIndex++;

			const viewModel = await createArrayOfSavedPeopleView.call(this, currentUser.savedPeople, currentUser.currentPageIndex, currentUser);

			await asyncSetTimeout(500);

			await editMessageApi({
				message: `Найдено ${viewModel.countPeople} сохраненных людей ${currentUser.lengthOfPages ? `, страница ${currentUser.currentPageIndex + 1} из ${currentUser.lengthOfPages}:` : ""}`,
				conversation_message_id: currentUser.currentTable.message_id,
				peer_id: currentUser.currentTable.peer,
				keyboard: this.Keyboard.keyboard(viewModel.buttons).inline(),
				v: 5.199
			});
		}

		return await next();
	});
}

async function createArrayOfSavedPeopleView(savedPeople, currentPageIndex, currentUser) {
	const pages = buttonsDividerHook(savedPeople.rows);
	const arrayOfSavedPeopleButtons = [];

	creatingButtonsList.call(this, savedPeople.result, arrayOfSavedPeopleButtons, pages, savedPeople.text, currentPageIndex, currentUser);
	creatingNavigationButtons.call(this, arrayOfSavedPeopleButtons, pages, currentPageIndex);

	return {
		buttons: arrayOfSavedPeopleButtons,
		countPeople: savedPeople.rows.length
	};
}

function creatingButtonsList(resultOfFetchData, parentArray, pages, errorText, currentPageIndex, currentUser) {
	
	if (resultOfFetchData) {
		for (const people of pages.at(currentPageIndex)) {
			parentArray.push(
				this.Keyboard.callbackButton({
					label: `${people.saved_TGNAME ?? "⛔"}`,
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

function creatingNavigationButtons(parentArray, pages, currentPageIndex) {
	if (pages.length < 2) {
		parentArray.push(this.Keyboard.homeButton);
		return; 
	} else if (currentPageIndex === 0) {
		parentArray.push([
			this.Keyboard.stopButton(),
			this.Keyboard.rightArrow({ direction: "Right", type: "pageNavigation" }),
		]);
	} else if ((currentPageIndex + 1) === pages.length) {
		parentArray.push([
			this.Keyboard.leftArrow({ direction: "Left", type: "pageNavigation" }),
			this.Keyboard.stopButton(),
		]);
	} else {
		parentArray.push([
			this.Keyboard.leftArrow({ direction: "Left", type: "pageNavigation" }),
			this.Keyboard.rightArrow({ direction: "Right", type: "pageNavigation" })
		]);
	}

	parentArray.push(this.Keyboard.homeButton);
}