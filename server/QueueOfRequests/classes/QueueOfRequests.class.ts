import { IQueueOfRequests } from "../interfaces/IQueueOfRequests.interface.js";
import { messageRequest } from "../types/messageRequest.type.js";

export class QueueOfRequests implements IQueueOfRequests {
	private queue: Map<number, messageRequest[]> = new Map<number, messageRequest[]>();
  
	constructor() {}
	
	getRequestsByTOID(TOID: number) {
		return this.queue.get(TOID);
	}

	addRequest(TOID: number, ...messageRequest: messageRequest[]): void {
		this.queue.set(TOID, messageRequest);
	}

	
}