import { IBotContext } from "../Context.interface.js";
import { getSavedPeopleByOwnerID } from "../../../../db/contollers/SavedPeople.controller.js";

export async function createUserContext(ctx: IBotContext, ownerID: number) {
	const savedPeople = await getSavedPeopleByOwnerID(ownerID);
    
	ctx.session.users[ctx.from?.id ?? "null"] = {
		rowID: 								ownerID,

		savedPeople: {
			result: 						savedPeople.result,
			text: 							savedPeople.text,
			rows: 							savedPeople.rows,
			currentPage: 				0,
			savedPeopleButtons: null,
		},
		
		scenes: {
			_firstTime: 				true,
			
			interlocutor: null,

			get firstTime() {
				const oldValue = this._firstTime;
				this._firstTime = false;
				return oldValue;
			}
		},
	};
}