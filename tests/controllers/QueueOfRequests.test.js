import { describe, expect, test} from "@jest/globals";
import { QueueOfRequests } from "../../dist/controllers/QueueOfRequests.controller.js";
import { MessageRequest } from "../../dist/controllers/MessageRequest.controller.js";


describe("Controller of QueueOfRequests", () => {
	const queueOfRequests = new QueueOfRequests();
	const messageRequest = new MessageRequest();
  
	test("adds one to the Queue", () => {
		queueOfRequests.addInQueue(228, messageRequest.createMessageRequest({
			senderId: 999,
			text: "Hello!",
			createdAt: Date.now()
		}));

		expect(queueOfRequests.getOneFromQueue(228, 999).FROMID).toBe(999);
		queueOfRequests.clearQueue();
	});

	test("gets all from the Queue", () => {
		for (let i = 0; i < 10; i++) {
			queueOfRequests.addInQueue(228, messageRequest.createMessageRequest({
				senderId: i,
				text: "Hello!",
				createdAt: Date.now()
			}));
		}
    
		expect(queueOfRequests.getAllFromQueue(228).length).toBe(10);
		queueOfRequests.clearQueue();
	});

	test("gets one from the Queue", () => {
		queueOfRequests.addInQueue(228, messageRequest.createMessageRequest({
			senderId: 999,
			text: "Hello!",
			createdAt: Date.now()
		}));

		expect(queueOfRequests.getOneFromQueue(228, 999).FROMID).toBe(999);
		queueOfRequests.clearQueue();
	});
});