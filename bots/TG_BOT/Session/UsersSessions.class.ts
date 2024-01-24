import { getSavedPeopleByOwnerID } from "../../../db/contollers/SavedPeople.controller.js";
import { User } from "../User/type/User.type.js";

export class UsersSessions {
	private users: { [userId: string]: User } = {};
  
	constructor() {
		setInterval(this.clearUsers, 3 * 60 * 60 * 1000); //Cleans up data of users every 3 hours
	}

	public isUser(ID: number | null | undefined): boolean {
		return !!this.users[ID ?? "null"];
	}
  
	public getUser(ID: number): User {
		return this.users[ID];
	}
  
	public async createUser(ID: number | null | undefined, ownerID: number, username: string | undefined): Promise<void> {
		const savedPeople = await getSavedPeopleByOwnerID(ownerID);

		this.users[ID ?? "null"] = {
			rowID: 		ownerID,
			username: username ?? "No username",

			savedPeople: {
				result: savedPeople.result,
				text: savedPeople.text,
				rows: savedPeople.rows,
				currentPage: 0,
				savedPeopleButtons: null,
			},

			scenes: {
				_firstTime: 				 true,
				interlocutor: 			 null,
				clearIntervalNumber: undefined,

				get firstTime() {
					const oldValue 	= this._firstTime;
					this._firstTime = false					 ;
					
					return oldValue;
				}
			},
		};
	}
  
	private clearUsers() {
		this.users = {};
	}
}