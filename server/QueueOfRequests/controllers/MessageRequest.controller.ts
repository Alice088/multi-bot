import { IMessageRequest } from "../interfaces/IMessageRequest.interface.js";
import { message } from "../types/message.type.js";
import { messageRequest } from "../types/messageRequest.type.js";
import { MessageContext } from "vk-io";


export class MessageRequest implements IMessageRequest {
	private requestID;

	constructor() {
		this.requestID = 0;
	}

	createMessageRequest<Contex extends MessageContext>(ctx: Contex): messageRequest {
		return {
			FROMID: ctx?.update?.message.from.id ?? ctx.senderId,
			messages: ([{
				text: ctx?.update?.message.text ?? ctx.text,
				timeStamp: ctx?.update?.message.date ?? ctx.createdAt
			}
			]) as message[],
			requestID: this.requestID++
		};
	}

	editTextMessageRequest(request: messageRequest, newText: string, messagesIndex: number): void {
		request.messages[messagesIndex].text = `${newText} (ред. ${new Date(request.messages[messagesIndex].timeStamp).toLocaleString("ru-RU")})`;
	}
}