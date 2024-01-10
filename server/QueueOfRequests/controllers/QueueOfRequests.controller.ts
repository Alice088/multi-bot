import { IQueueOfRequests } from "../interfaces/IQueueOfRequests.interface.js";
import { messageRequest } from "../types/messageRequest.type.js";

export class QueueOfRequests implements IQueueOfRequests {
	private queue: Map<number, messageRequest[]> = new Map<number, messageRequest[]>();
  
	constructor() {}
	
	getRequestsByTOID(TOID: number) {
		return this.queue.get(TOID);
	}

	addRequest(TOID: number, messageRequest: messageRequest): void {
		const requests = this.getRequestsByTOID(TOID);

		if (!requests) {
			this.queue.set(TOID, [messageRequest]);
			return;
		}

		requests?.forEach((request, index) => {
			if (request.FROMID === messageRequest.FROMID) request.messages.push(...messageRequest.messages);
			else if ((index + 1) === requests.length) requests.push(messageRequest);
		});
	}

	deleteRequest(TOID: number, FROMID: number, indexMessage: number): void {
		const requests = this.getRequestsByTOID(TOID);

		requests?.forEach((request) => {
			if (request.FROMID === FROMID) request.messages.splice(indexMessage, indexMessage + 1);
		});
	}
}