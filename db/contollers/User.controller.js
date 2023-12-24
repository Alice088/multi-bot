import { connection } from "../Database.config.js";

export async function createUser(tgid, vkid) {
	const resultOfCheck = await checkUsernameDuplicates(tgid ? tgid : vkid);

	if (resultOfCheck.result) {
		const [rows] = await connection.execute("INSERT INTO users (TGID, VKID) VALUES (?, ?)", [tgid ?? null, vkid ?? null])
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
	} else {
		resultOfCheck;
	}
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

export async function checkUsernameDuplicates(anyUsername) {
	const data = await getUser(anyUsername);
	
	if (!data.result && (data.rows.length === 0)) {
		return {
			result: true,
			text: null
		};
	} else {
		return {
			result: false,
			text: data.text
		};
	}
	//if duplictes isn't found then true
	//else false
}

export async function getUser(anyUsername) {
	const [rows] = await connection.execute(`SELECT * FROM users WHERE VKID LIKE "${anyUsername}" OR TGID LIKE "${anyUsername}"`)
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