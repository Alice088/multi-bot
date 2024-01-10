import { IMessageRequest } from "../interfaces/IMessageRequest.interface";
import { messageRequest } from "../types/messageRequest.type";
import { MessageContext } from "vk-io";


export class MessageRequest implements IMessageRequest {
	createMessageRequest<Contex extends MessageContext>(ctx: Contex, TOID: number): messageRequest {
		return {
			FROMID: ctx.update.message.from.id ?? ctx.senderId,
			TOID: TOID,
			text: ([ctx.update.message.text || ctx.text]) as string[],
			timeStamp: ctx.update.message.date ?? ctx.createdAt
		};
	}

	editTextMessageRequest(request: messageRequest, newText: string, idOfMessage: number): void {
		const oldMessage = request.text[idOfMessage];
		const newMessage = `${newText} (ред. ${new Date(Date.now() - request.timeStamp).getHours}) часов назад`;
  
		request.text = request.text.map(msg => {
			if (msg === oldMessage) {
				return newMessage;
			} else return msg;
		});
	}
}