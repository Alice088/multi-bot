import { connection } from "../Database.config.js";

export async function createUser(tgid, vkid) {
	const [rows] = await connection.execute(`INSERT INTO users (TGID, VKID) VALUES (${tgid}, ${vkid})`)
		.catch(error => {
			console.error("Error in createUser: \n", error);

			return {
				result: false,
				text: `Ошибка!: ${error.code}, сообщеие: ${error.message}`
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

export async function getUser(ID) {
	const [rows] = await connection.execute(`SELECT * FROM users WHERE VKID = ${ID} OR TGID = ${ID}`)
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

export async function updateTGUsername(newTGID, id) {
	await connection.execute("UPDATE users SET TGID = ? WHERE ID = ?", [newTGID, id])
		.catch(error => {
			console.error("Error in updateTGUsername: \n", error);
				
			return {
				result: false,
				text: `Ошибка!: ${error.code}, сообщеие: ${error.message}`
			};
		});
		
	return { result: true, text: "Успешно" };
}

export async function updateVKUsername(newVKID, id) {
	await connection.execute("UPDATE users SET VKID = ? WHERE ID = ?", [newVKID, id])
		.catch(error => {
			console.error("Error in updateVKUsername: \n", error);
				
			return {
				result: false,
				text: `Ошибка!: ${error.code}, сообщеие: ${error.message}`
			};
		});
		
	return { result: true, text: "Успешно" };
}

export async function deleteUser(id) {
	await connection.execute("DELETE FROM users WHERE ID = ?", [id])
		.catch(error => {
			console.error("Error in deleteUser: \n", error);
				
			return {
				result: false,
				text: `Ошибка!: ${error.code}, сообщеие: ${error.message}`
			};
		});
		
	return { result: true, text: "Успешно" };
}