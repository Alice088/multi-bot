import { connection } from "../Database.config.js";

export async function addSavedPeople(ownerID, TGID, TGNAME) {
	await connection.execute("INSERT INTO saved_people (ownerID, saved_TGID, saved_TGNAME) VALUES (?, ?, ?)", [
		ownerID, TGID, TGNAME
	])
		.catch(error => {
			console.error(error);

			return {
				result: false,
				text: `Ошибка!: ${error.code}, сообщеие: ${error.message}`
			};
		});
}