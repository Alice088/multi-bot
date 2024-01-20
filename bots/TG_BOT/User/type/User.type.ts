import { createButtons } from "../../Commands/SavedPeople.command.js";
import { SavedPeople } from "./SavedPeople.type.js";

export type User = {
  row_id:         number,
  saved_people: {
    result:       boolean,
    text:         string | null,
    rows:         SavedPeople[]
  },
  currentPage: number,
  savedPeopleButtons: ReturnType<typeof createButtons> | null
}