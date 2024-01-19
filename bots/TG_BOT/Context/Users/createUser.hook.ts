import { IBotContext } from "../Context.interface.js";
import { getSavedPeopleByOwnerID } from "../../../../db/contollers/SavedPeople.controller.js";

export async function createUserContext(ctx: IBotContext, ownerID: number) {
	if (ctx.message && ctx.message.from.username) {
		const savedPeople = await getSavedPeopleByOwnerID(ownerID);
    
		ctx.session.users[ctx.message.from.id] = {
			row_id: ownerID,
			saved_people: savedPeople.rows
		};
	}  
}