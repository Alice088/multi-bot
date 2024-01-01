import { connection } from "../Database.config.js";

export async function addSavedPeople(ownerID, saved_TGID, saved_TGNAME, saved_VKID, saved_VKNAME) {
	const [rows] = await connection.execute(`
		INSERT INTO saved_people (ownerID, saved_TGID, saved_TGNAME, saved_VKID, saved_VKNAME)
	 	VALUES (?, ?, ?, ?, ?)`, [ownerID, saved_TGID, saved_TGNAME, saved_VKID, saved_VKNAME]
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
	const [rows] = await connection.execute("SELECT * FROM saved_people WHERE ownerID IN (?)", [ownerID])
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

export async function checkVkAndTgIdDuplicate(ownerID, tgid, vkid) {
	const [rows] = await connection.execute(`
	SELECT saved_TGID, saved_VKID, ID FROM saved_people
	WHERE ownerID = ?
	and saved_VKID = ?
	OR saved_TGID = ?`, [ownerID, vkid, tgid]
	)
		.catch(error => {
			console.error(error);

			return {
				result: false,
				text: `Ошибка!: ${error.code}, сообщеие: ${error.message}`
			};
		});
	
	const whereIsDupclicate = new Map();
	const whereDuplicateIsnt = new Map();

	rows.forEach(row => {
		const placeOfDuplicate = [];
		const freePlace = [];

		for (const [key, value] of Object.entries(row)) {
			if ((value === tgid | value === vkid) && (key !== "ID")) {
				placeOfDuplicate.push(key);
			} else if (key !== "ID" && !value) {
				freePlace.push(key);
			}
		}

		whereIsDupclicate.set(row.ID, placeOfDuplicate);
		whereDuplicateIsnt.set(row.ID, freePlace);
	});

	if (!rows.length) {
		return {
			result: true,
			text: "Дубликатов нет"
		};
	} else {
		return {
			result: false,
			whereIsDupclicate: whereIsDupclicate,
			whereDuplicateIsnt: whereDuplicateIsnt.size === 0 ? "Пустых ячеек не найдено" : whereDuplicateIsnt,
			text: "Обнаружены дубликаты для вашего профиля по определенному пользователю",
			rows: rows,
		};
	}
}