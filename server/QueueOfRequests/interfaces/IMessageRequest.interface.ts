import { messageRequest } from "../types/messageRequest.type";
import { MessageContext } from "vk-io";


export interface IMessageRequest {
  createMessageRequest<Contex extends MessageContext>(ctx: Contex, TOID: number): messageRequest

  editTextMessageRequest(request: messageRequest, newText: string, idOfMessage: number): void;
}