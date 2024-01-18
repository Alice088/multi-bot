import { SavedPeople } from "./SavedPeople.js";

export type User = {
  id: number,
  first_name: string,
  last_name: string,
  username: string
  row_id: number,
  saved_people: SavedPeople[]
}