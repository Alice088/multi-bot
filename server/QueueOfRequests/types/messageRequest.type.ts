import { message } from "./message.type.js";

export type messageRequest = {
  readonly FROMID: number,
  readonly messages: message[],
  readonly requestID: number
}