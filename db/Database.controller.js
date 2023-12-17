import { connection } from "./Database.config.js";


export class DatabaseController {

	constructor() {}

	async createUser(tgid, vkid) {
		await connection.execute("INSERT INTO users (TGID, VKID) VALUES (?, ?)", [tgid ?? null, vkid ?? null])
			.catch(error => {
				console.error("Error in createUser: \n", error);
				throw error;
			});
		
		return await connection.execute("SELECT * FROM users WHERE VKID LIKE ? OR TGID LIKE ?", [vkid, tgid])
			.catch(error => {
				console.error("Error in createUser during get user: \n", error);
				throw error;
			});
	}
    
	async getUsers() {
		return await connection.execute("SELECT * FROM users")
			.catch(error => {
				console.error("Error in getUsers: \n", error);
				throw error;
			});
	}

	async getUser(username) {
		return await connection.execute("SELECT * FROM users WHERE VKTG LIKE ? OR TGID LIKE ?", [username])
			.catch(error => {
				console.error("Error in getUser: \n", error);
				throw error;
			});
	}

	async updateTGUsername(tgid, id) {
		await connection.execute("UPDATE users SET TGID = ? WHERE ID = ?", [tgid, id])
			.catch(error => {
				console.error("Error in updateTGUsername: \n", error);
				throw error;
			});
		
		return true;
	}

	async updateVKUsername(tgid, id) {
		await connection.execute("UPDATE users SET VKID = ? WHERE ID = ?", [tgid, id])
			.catch(error => {
				console.error("Error in updateVKUsername: \n", error);
				throw error;
			});
		
		return true;
	}

	async deleteUser(id) {
		await connection.execute("DELETE FROM user WHERE ID = ?", [id])
			.catch(error => {
				console.error("Error in deleteUser: \n", error);
				throw error;
			});
		
		return true;
	}
}