import { messageRequest } from "../types/messageRequest.type.js";
import { QueueMenager } from "../classes/QueueManager.abstract.js";

export class QueueOfRequests extends QueueMenager<number, messageRequest> {
	constructor() {
		super();
	}

	getFromQueue(TOID: number) {
		return this.queue.get(TOID);
	}

	addInQueue(TOID: number, messageRequest: messageRequest): void {
		const requests = this.getFromQueue(TOID);

		if (!requests) {
			this.queue.set(TOID, [messageRequest]);
			return;
		}

		requests?.forEach((request, index) => {
			if (request.FROMID === messageRequest.FROMID) request.messages.push(...messageRequest.messages);
			else if ((index + 1) === requests.length) requests.push(messageRequest);
		});
	}

	deleteFromQueue(TOID: number, requestID: number, ...indexMessage: number[]): void {
		const requests = this.getFromQueue(TOID);
		const request = requests?.find((req) => req.requestID === requestID);

		if (request) request.messages.splice(indexMessage[0], indexMessage[0] + 1);
	}
}