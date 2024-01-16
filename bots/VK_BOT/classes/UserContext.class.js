export class UserContext {
	users = {};
  
	constructor() { 
		setInterval(this.clearUsers, 3 * 60 * 60 * 1000); //Cleans up data of users every 3 hours
	}
  
	getUserContextById(id) {
		const userContext = this.users[id];

		if (userContext) return userContext;
		else {
			this.users[id] = {};
			return userContext;
		}
	}
  
	clearUsers() {
		this.users = {};
	}
}