import { SavedPeople } from "../../bots/TG_BOT/User/type/SavedPeople.type.js";
import { connection } from "../Database.config.js";
import * as mysql from "mysql2/promise";

export async function addSavedPeople(ownerID: number, savedUserID: number, telegramUsername: string, vkontakteUsername: string) {
	const [rows] = await connection.execute(`
		INSERT INTO saved_people (Owner_ID, Saved_User_ID, Saved_Telegram_Username, Saved_Vkontakte_Username)
	 	VALUES (?, ?, ?, ?)`, [ownerID, savedUserID, telegramUsername, vkontakteUsername]
	).catch(error => {
		console.error(error);

		return {
			result: false,
			text: `Ошибка!: ${error.code}, сообщеие: ${error.message}`
		};
	}) as mysql.RowDataPacket[];
	
	return {
		result: true,
		id: rows.insertId,
		text: "Успешно"
	};
}

export async function deleteSavedPeople(id: number) {
	await connection.execute("DELETE FROM saved_people WHERE ID = ?", [id])
		.catch(error => {
			console.error(error);

			return {
				result: false,
				text: `Ошибка!: ${error.code}, сообщеие: ${error.message}`
			};
		});
	
	return {
		result: true,
		text: "Успешно"
	};
}

export async function getSavedPeopleByOwnerID(ownerID: number) {
	const [rows] = await connection.execute("SELECT * FROM saved_people WHERE Owner_ID IN (?)", [ownerID])
		.catch(error => {
			console.error(error);

			return {
				result: false,
				text: `Ошибка!: ${error.code}, сообщеие: ${error.message}`
			};
		}) as mysql.RowDataPacket[];

	return {
		rows: rows as SavedPeople[],
		result: rows.length === 0 ? false : true,
		text: rows.length === 0 ? "Люди не найдены" : null
	};
}

export async function getSavedPeopleByID(ID: number) {
	const [rows] = await connection.execute("SELECT * FROM saved_people WHERE ID = ?", [ID])
		.catch(error => {
			console.error(error);

			return {
				result: false,
				text: `Ошибка!: ${error.code}, сообщеие: ${error.message}`
			};
		}) as mysql.RowDataPacket[];

	return {
		rows: rows as SavedPeople[],
		result: rows.length === 0 ? false : true,
		text: rows.length === 0 ? "Человек не найден" : null
	};
}

export async function checkDuplicateSavedPeople(ownerID: number, username: string) {
	const savedPeople = await getSavedPeopleByOwnerID(ownerID);

	let arrayOfPeople = [];
	for (const key of Object.keys(savedPeople.rows)) {
		arrayOfPeople?.push(key, key);
	}

	arrayOfPeople ??= [{}];

	return arrayOfPeople.includes(username);
}