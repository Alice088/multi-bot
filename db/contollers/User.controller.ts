import * as mysql from "mysql2/promise";
import { connection } from "../Database.config.js";

type User = {
	ID: number,
	Vkontakte_Username: string | null,
	Telegram_Username: string | null
}

export async function createUser(telegramUsername: string | null, vkontakteUsername: string | null) {
	const [rows] = await connection.execute("INSERT INTO users (Vkontakte_Username, Telegram_Username) VALUES (?, ?)", [vkontakteUsername, telegramUsername])
		.catch(error => {
			console.error("Error in createUser: \n", error);

			return {
				result: false,
				text: `Ошибка!: ${error.code}, сообщеие: ${error.message}`,
			};
		}) as mysql.RowDataPacket[];

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
		}) as mysql.RowDataPacket[];
	
	return {
		rows: rows as User[],
		result: true
	};
}

export async function getUserByID(ID: number) {
	const [rows] = await connection.execute("SELECT * FROM users WHERE ID = ?", [ID])
		.catch(error => {
			console.error("Error in getUser: \n", error);
				
			return {
				result: false,
				text: `Ошибка!: ${error.code}, сообщеие: ${error.message}`
			};
		}) as mysql.RowDataPacket[];
	
	return {
		rows: rows as User[],
		result: rows.length === 0 ? false : true,
		text: rows.length === 0 ? "Человек не найден" : null
	};
}

export async function getUserByUsername(username: string) {
	const [rows] = await connection.execute("SELECT * FROM users WHERE Vkontakte_Username LIKE ? OR Telegram_Username LIKE ?", [username, username])
		.catch(error => {
			console.error("Error in getUser: \n", error);

			return {
				result: false,
				text: `Ошибка!: ${error.code}, сообщеие: ${error.message}`
			};
		}) as mysql.RowDataPacket[];

	return {
		rows: rows as User[],
		result: rows.length === 0 ? false : true,
		text: rows.length === 0 ? "Человек не найден" : null
	};
}

export async function updateTGUsername(newTelegramUsername: string, ID: number) {
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

export async function updateVKUsername(newVkontakteUsername: string, ID: number) {
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

export async function deleteUser(ID: number) {
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