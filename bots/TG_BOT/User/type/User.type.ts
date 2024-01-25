import { createButtons } from "../../Commands/SavedPeople.command.js";
import { SavedPeople } from "./SavedPeople.type.js";

export type User = {
  rowID   : number,
  username: string
  
  savedPeople: {
    result            : boolean,
    text              : string | null,
    rows              : SavedPeople[],
    currentPage       : number,
    savedPeopleButtons: ReturnType<typeof createButtons> | null,
  },

  scenes: {
    _firstTime                       : boolean,
    interlocutor                     : { ID: number, username: string } | null,
    clearCheckMSGInterlocutorInterval: ReturnType<typeof setInterval> | undefined,
    clearCheckInterlocutorInterval   : ReturnType<typeof setInterval> | undefined,
    get firstTime()                  : boolean
  }
}