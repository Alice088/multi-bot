import { connection } from "../Database.config.js";

export async function createUser(telegramUsername, vkontakteUsername) {
	const [rows] = await connection.execute("INSERT INTO users (Vkontakte_Username, Telegram_Username) VALUES (?, ?)", [vkontakteUsername, telegramUsername])
		.catch(error => {
			console.error("Error in createUser: \n", error);

			return {
				result: false,
				text: `Ошибка!: ${error.code}, сообщеие: ${error.message}`,
			};
		});

	return {
		ownerID: rows.insertId,
		result: true,
	};
}
    
export async function getAllUsers() {
	const [rows] = await connection.execute("SELECT * FROM users")
		.catch(error => {
			console.error("Error in getUsers: \n", error);

			return {
				result: false,
				text: `Ошибка!: ${error.code}, сообщеие: ${error.message}`
			};
		});
	
	return {
		rows: rows,
		result: true
	};
}

export async function getUserByID(ID) {
	const [rows] = await connection.execute("SELECT * FROM users WHERE ID = ?", [ID])
		.catch(error => {
			console.error("Error in getUser: \n", error);
				
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

export async function getUserByUsername(username) {
	const [rows] = await connection.execute("SELECT * FROM users WHERE Vkontakte_Username LIKE ? OR Telegram_Username LIKE ?", [username, username])
		.catch(error => {
			console.error("Error in getUser: \n", error);

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

export async function updateTGUsername(newTelegramUsername, ID) {
	await connection.execute("UPDATE users SET Telegram_Username = ? WHERE ID = ?", [newTelegramUsername, ID])
		.catch(error => {
			console.error("Error in updateTGUsername: \n", error);
				
			return {
				result: false,
				text: `Ошибка!: ${error.code}, сообщеие: ${error.message}`
			};
		});
		
	return { result: true, text: "Успешно" };
}

export async function updateVKUsername(newVkontakteUsername, ID) {
	await connection.execute("UPDATE users SET Vkontakte_Username = ? WHERE ID = ?", [newVkontakteUsername, ID])
		.catch(error => {
			console.error("Error in updateVKUsername: \n", error);
				
			return {
				result: false,
				text: `Ошибка!: ${error.code}, сообщеие: ${error.message}`
			};
		});
		
	return { result: true, text: "Успешно" };
}

export async function deleteUser(ID) {
	await connection.execute("DELETE FROM users WHERE ID = ?", [ID])
		.catch(error => {
			console.error("Error in deleteUser: \n", error);
				
			return {
				result: false,
				text: `Ошибка!: ${error.code}, сообщеие: ${error.message}`
			};
		});
		
	return { result: true, text: "Успешно" };
}