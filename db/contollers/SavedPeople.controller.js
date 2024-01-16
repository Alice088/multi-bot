import { connection } from "../Database.config.js";

export async function addSavedPeople(ownerID, savedUserID, telegramUsername, vkontakteUsername) {
	const [rows] = await connection.execute(`
		INSERT INTO saved_people (Owner_ID, Saved_User_ID, Saved_Telegram_Username, Saved_Vkontakte_Username)
	 	VALUES (?, ?, ?, ?)`, [ownerID, savedUserID, telegramUsername, vkontakteUsername]
	).catch(error => {
		console.error(error);

		return {
			result: false,
			text: `Ошибка!: ${error.code}, сообщеие: ${error.message}`
		};
	});
	
	return {
		result: true,
		id: rows.insertId,
		text: "Успешно"
	};
}

export async function deleteSavedPeople(id) {
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

export async function getSavedPeopleByOwnerID(ownerID) {
	const [rows] = await connection.execute("SELECT * FROM saved_people WHERE Owner_ID IN (?)", [ownerID])
		.catch(error => {
			console.error(error);

			return {
				result: false,
				text: `Ошибка!: ${error.code}, сообщеие: ${error.message}`
			};
		});

	return {
		rows: rows,
		result: rows.length === 0 ? false : true,
		text: rows.length === 0 ? "Люди не найдены" : null
	};
}

export async function getSavedPeopleByID(ID) {
	const [rows] = await connection.execute("SELECT * FROM saved_people WHERE ID = ?", [ID])
		.catch(error => {
			console.error(error);

			return {
				result: false,
				text: `Ошибка!: ${error.code}, сообщеие: ${error.message}`
			};
		});

	return {
		rows: rows,
		result: rows.length === 0 ? false : true,
		text: rows.length === 0 ? "Человек не найден" : null
	};
}

export async function checkDuplicateSavedPeople(ownerID, username) {
	const savedPeople = await getSavedPeopleByOwnerID(ownerID);

	return [...Object.values(...savedPeople.rows)].includes(username);
}