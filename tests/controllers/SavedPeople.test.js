import { connection } from "../../db/Database.config";
import { createUser, deleteUser } from "../../db/contollers/User.controller";
import { addSavedPeople, getSavedPeopleByID, getSavedPeopleByOwner, deleteSavedPeople, checkVkAndTgIdDuplicate } from "../../db/contollers/SavedPeople.controller";

import { describe, expect, test, afterAll, beforeAll } from "@jest/globals";

let testUserId;

describe("CRUD of saved_people", () => {
	test("ADD_SAVED_PEOPLE: adds new saved people, return { result: boolean, id: number, text: string }", async () => {
		const data = await addSavedPeople(testUserId, "alice", "Говф_ьшфв", null, null);
    
		const rows = await getSavedPeopleByID(data.id);

		expect(data.result).toBeTruthy();
		if(rows.result) await deleteSavedPeople(data.id);
	});
  
	test("GET_SAVED_PEOPLE_BY_ID: gets savedPeople by ID, return { result: boolean, rows: savedPeople, text: string }", async () => {
		const data = await addSavedPeople(testUserId, "TEST_TEST_TEST", null, null, "TEST_TEST_TEST");
    
		const rows = await getSavedPeopleByID(data.id);
    
		expect(rows.result).toBeTruthy();
		if(data.result) await deleteSavedPeople(data.id);
	});

	test("GET_SAVED_PEOPLE_BY_OWNERID: gets savedPeople[] by ownerID, return { result: boolean, rows: savedPeople[], text: string }", async () => {
		const data = await addSavedPeople(testUserId, "TEST_TEST_TEST", null, null, "TEST_TEST_TEST");
    
		const rows = await getSavedPeopleByOwner(testUserId);
    
		expect(rows.result).toBeTruthy();
		if(data.result) await deleteSavedPeople(data.id);
	});

	test(
		"CHECK_VK_AND_TG_ID_DUPLICATE: checks duplicates in saved_people by ownerID," +
		`
			return {
				result: boolean,
				whereIsDupclicate: Map of the duplicate<rowID, Keys of the duplicate rows[]>,
				whereDuplicateIsnt: Map of the rows where is null and free for putting
				text: string,
				rows: row[]
			}
		`, async () => {
			const data = await checkVkAndTgIdDuplicate(testUserId, null, null);

			expect(data.result).toBeTruthy();
		});
});

beforeAll(async () => {
	const { ownerID } = await createUser("TESTER", "TESTER");
	testUserId = ownerID;
});

afterAll(async () => {
	await deleteUser(testUserId);

	await connection.end()
		.then(() => {
			console.log("The DB was closed");
		})
		.catch((error) => {
			console.error("The DB was closed because: ", error);
		});
});