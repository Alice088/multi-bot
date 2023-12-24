import { createUser, deleteUser, getAllUsers, getUser, checkUsernameDuplicates, updateTGUsername, updateVKUsername } from "../../db/contollers/User.controller";
import { connection } from "../../db/Database.config";
import { describe, expect, test, afterAll } from "@jest/globals";

describe("CRUD of User", () => {
	
	test("GET_USER: gets a User by his username, return { result: boolean, text: string | rows: User }", async () => {
		const newUser = await createUser("TEST_TEST_TEST_TEST");

		const data = await getUser("TEST_TEST_TEST_TEST");

		expect(data.result).toBeTruthy();
		if(newUser.result) deleteUser(newUser.ownerID);
	});

	test("CHECK_USERNAME_DUPLICATES: checks duplicate of usernames, return { result: boolean, text: string }", async () => {
		const data = await checkUsernameDuplicates("Alamdaoisdij93@a//x._0sa021aSDs1");

		expect(data.result).toBeTruthy();
	});

	test("DELETE_USER: deletes user by id, return { result: boolean, text: string }", async () => {
		const newUser = await createUser("TEST_TEST_TEST_TEST");

		const data = await deleteUser(newUser.ownerID);

		expect(data.result).toBeTruthy();
	});

	test("CREATE_USER: creates new User, return { result: boolean, text: string | ownerId: number }", async () => {
		const data = await createUser("TEST_TEST_TEST", null);

		expect(data.result).toBeTruthy();

		if(data.result) deleteUser(data.ownerID);
	});

	test("GET_ALL_USER: gets all Users, return { result: boolean, text: string | rows: Users[] }", async () => {
		const data = await getAllUsers();

		expect(data.result).toBeTruthy();
	});

	test("UPDATE_IDS: update id of user, return { result: boolean, text: string }", async () => {
		let totalResult = false;
		const newUser = await createUser("TEST_TEST_TEST_TEST", "TEST_TEST_TEST");

		const vkUserResult = await updateTGUsername("TG_TEST", newUser.ownerID).then((data) => data.result);
		const tgUserResult = await updateVKUsername("VK_TEST", newUser.ownerID).then((data) => data.result);

		if (vkUserResult & tgUserResult) {
			const {rows} = await getUser("TG_TEST");
			totalResult = rows[0].TGID === "TG_TEST" && rows[0].VKID === "VK_TEST";
			await deleteUser(newUser.ownerID);
		}

		expect(totalResult).toBeTruthy();
	});
});

afterAll(async () => {
	await connection.end()
		.then(() => {
			console.log("The DB was closed");
		})
		.catch((error) => {
			console.error("The DB was closed because: ", error);
		});
});