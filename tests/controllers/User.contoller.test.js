import { createUser, deleteUser, getAllUsers, getUserByUsername, getUserByID, updateTGUsername, updateVKUsername } from "../../dist/db/contollers/User.controller.js";
import { connection } from "../../dist/db/Database.config.js";
import { describe, expect, test, afterAll } from "@jest/globals";

const newUser = await createUser("\"@@Bogdan\"", "\"@@SuperDuperBogdan\"");

describe("CRUD of User", () => {
	test("CREATE_USER: creates new User, return { result: boolean, text: string | ownerId: number }", async () => {
		expect(newUser.result).toBeTruthy();
	});

	test("GET_USER_BY_ID: gets a User by his ID, return { result: boolean, text: string | rows: User }", async () => {
		const data = await getUserByID(newUser.ownerID);

		expect(data.result).toBeTruthy();
	});

	test("GET_USER_BY_USERNAME: gets a User by his Username, return { result: boolean, text: string | rows: User }", async () => {
		const data = await getUserByUsername("\"@@Bogdan\"");

		expect(data.result).toBeTruthy();
	});


	test("GET_ALL_USER: gets all Users, return { result: boolean, text: string | rows: Users[] }", async () => {
		const data = await getAllUsers();

		expect(data.result).toBeTruthy();
	});

	test("UPDATE_IDS: update id of user, return { result: boolean, text: string }", async () => {
		let totalResult = false;

		const vkUserResult = await updateTGUsername("\"@@SuperGoshan\"", newUser.ownerID);
		const tgUserResult = await updateVKUsername("\"@@SuperGoshanes122\"", newUser.ownerID);

		if (vkUserResult.result & tgUserResult.result) {
			const gotNewUserData = await getUserByID(newUser.ownerID);
			totalResult = gotNewUserData.rows[0].Telegram_Username === "\"@@SuperGoshan\"" && gotNewUserData.rows[0].Vkontakte_Username === "\"@@SuperGoshanes122\"";
		}

		expect(totalResult).toBeTruthy();
	});

	test("DELETE_USER: deletes user by id, return { result: boolean, text: string }", async () => {
		const data = await deleteUser(newUser.ownerID);

		expect(data.result).toBeTruthy();
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