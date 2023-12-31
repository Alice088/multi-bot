import { createUser, deleteUser, getAllUsers, getUser, updateTGUsername, updateVKUsername } from "../../db/contollers/User.controller";
import { connection } from "../../db/Database.config";
import { describe, expect, test, afterAll } from "@jest/globals";

let newUser = await createUser(11212312, 777777777);

describe("CRUD of User", () => {
	test("GET_USER: gets a User by his username, return { result: boolean, text: string | rows: User }", async () => {
		const data = await getUser(777777777);

		expect(data.result).toBeTruthy();
	});


	test("DELETE_USER: deletes user by id, return { result: boolean, text: string }", async () => {
		const testUser = await createUser(9999999999, null);

		const data = await deleteUser(testUser.ownerID);

		expect(data.result).toBeTruthy();
	});

	test("CREATE_USER: creates new User, return { result: boolean, text: string | ownerId: number }", async () => {
		const testUser = await createUser(222222222, null);

		expect(testUser.result).toBeTruthy();

		if(testUser.result) deleteUser(testUser.ownerID);
	});

	test("GET_ALL_USER: gets all Users, return { result: boolean, text: string | rows: Users[] }", async () => {
		const data = await getAllUsers();

		expect(data.result).toBeTruthy();
	});

	test("UPDATE_IDS: update id of user, return { result: boolean, text: string }", async () => {
		let totalResult = false;

		const vkUserResult = await updateTGUsername(19281223412312, newUser.ownerID).then((data) => data.result);
		const tgUserResult = await updateVKUsername(19281223412332, newUser.ownerID).then((data) => data.result);

		if (vkUserResult & tgUserResult) {
			const {rows} = await getUser(19281223412312);
			totalResult = rows[0].TGID === 19281223412312 && rows[0].VKID === 19281223412332;
		}

		expect(totalResult).toBeTruthy();
	});
});

afterAll(async () => {
	await deleteUser(newUser.ownerID);

	await connection.end()
		.then(() => {
			console.log("The DB was closed");
		})
		.catch((error) => {
			console.error("The DB was closed because: ", error);
		});
});