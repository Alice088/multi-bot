import { Context } from "telegraf";
import { User } from "../User/type/User.type.js";

export interface sessionData {
  users: { [user_id: string]: User[] }
}

export interface IBotContext extends Context {
  session: sessionData;
}