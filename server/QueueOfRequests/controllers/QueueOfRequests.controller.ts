import { messageRequest } from "../types/messageRequest.type.js";
import { QueueMenager } from "../classes/QueueManager.abstract.js";

export class QueueOfRequests extends QueueMenager<number, messageRequest> {
	constructor() {
		super();
	}

	getAllFromQueue(TOID: number) {
		return this.queue.get(TOID);
	}

	getOneFromQueue(TOID: number, FROMID: number) {
		return this.getAllFromQueue(TOID)?.find((req) => req.FROMID === FROMID);
	}

	addInQueue(TOID: number, messageRequest: messageRequest): void {
		const requests = this.getAllFromQueue(TOID);

		if (!requests || requests.length === 0) {
			this.queue.set(TOID, [messageRequest]);
			return;
		}

		requests?.forEach((request, index) => {
			if (request.FROMID === messageRequest.FROMID) request.messages.push(...messageRequest.messages);
			else if ((index + 1) === requests.length) requests.push(messageRequest);
		});
	}

	deleteFromQueue(TOID: number, requestID: number, messageIndex: number): void {
		const requests = this.getAllFromQueue(TOID);
		const request = requests?.find((req) => req.requestID === requestID);
		request?.messages.splice(messageIndex, messageIndex + 1);
	}

	deleteAllRequestFromOneUserForOneUser(TOID: number, FROMID: number) {
		const requests = this.getAllFromQueue(TOID);

		if (requests) {
			const newArray = requests.filter((req) => req.FROMID !== FROMID );
			this.queue.set(TOID, newArray);
		}
	}

	clearQueue(): void {
		this.queue.clear();
	}
}