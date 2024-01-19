import { connection } from "../../dist/db/Database.config.js";
import { createUser, deleteUser } from "../../dist/db/contollers/User.controller.js";
import { addSavedPeople, getSavedPeopleByID, getSavedPeopleByOwnerID, deleteSavedPeople, checkDuplicateSavedPeople } from "../../dist/db/contollers/SavedPeople.controller.js";
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
		const savedPeople = await getSavedPeopleByOwnerID(newUser.ownerID);
    
		expect(savedPeople.result).toBeTruthy();
	});

	test("CHECK_DUPCILATES_IN_USERNAMES: check savedPeople[] for duplicate, return boolean", async () => {
		const isDuplicates = await checkDuplicateSavedPeople(newUser.ownerID, "\"@@GoshaSave\"");

		expect(isDuplicates).toBeTruthy();
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