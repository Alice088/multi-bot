import { connection } from "../../db/Database.config";
import { createUser, deleteUser } from "../../db/contollers/User.controller";
import { addSavedPeople, getSavedPeopleByID, getSavedPeopleByOwnerID, deleteSavedPeople } from "../../db/contollers/SavedPeople.controller";
import { describe, expect, test, afterAll } from "@jest/globals";

const newUser = await createUser("\"@@BogdanSave\"", "\"@@SuperDuperBogdanSave\""); 
const newSavedPeople = await addSavedPeople(newUser.ownerID, newUser.ownerID, "\"@@GoshaSave\"", "\"@@GoshaLoxSave\"");

describe("CRUD of saved_people", () => {
	test("ADD_SAVED_PEOPLE: adds new saved people, return { result: boolean, id: number, text: string }", async () => {
		const newSavedPeople = await addSavedPeople(newUser.ownerID, newUser.ownerID, "\"@@GoshaSave\"", "\"@@GoshaLoxSave\"");
		expect(newSavedPeople.result).toBeTruthy();
	});
  
	test("GET_SAVED_PEOPLE_BY_ID: gets savedPeople by ID, return { result: boolean, rows: savedPeople, text: string }", async () => {
		const rows = await getSavedPeopleByID(newSavedPeople.id);
    
		expect(rows.result).toBeTruthy();
	});

	test("GET_SAVED_PEOPLE_BY_OWNERID: gets savedPeople[] by ownerID, return { result: boolean, rows: savedPeople[], text: string }", async () => {
		const rows = await getSavedPeopleByOwnerID(newUser.ownerID);
    
		expect(rows.result).toBeTruthy();
	});
});

afterAll(async () => {
	await deleteUser(newUser.ownerID);
	await deleteSavedPeople(newSavedPeople.id);

	await connection.end()
		.then(() => {
			console.log("The DB was closed");
		})
		.catch((error) => {
			console.error("The DB was closed because: ", error);
		});
});