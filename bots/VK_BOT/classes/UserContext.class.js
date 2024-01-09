export class UserContext {
	users = {};
  
	constructor() { 
		setInterval(this.clearUsers, 3 * 60 * 60 * 1000); //Cleans up data of users every 3 hours
	}
  
	getUserContextById(id) {
		return this.users[id];
	}
  
	clearUsers() {
		this.users = {};
	}
}