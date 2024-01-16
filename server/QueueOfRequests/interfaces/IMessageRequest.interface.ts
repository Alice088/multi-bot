import { messageRequest } from "../types/messageRequest.type.js";
import { MessageContext } from "vk-io";


export interface IMessageRequest {
  createMessageRequest<Contex extends MessageContext>(ctx: Contex, FROMID: number): messageRequest

  editTextMessageRequest(request: messageRequest, newText: string, idOfMessage: number): void;
}