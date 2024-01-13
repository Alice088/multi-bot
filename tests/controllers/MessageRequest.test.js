import { describe, expect, test } from "@jest/globals";
import { MessageRequest } from "../../dist/controllers/MessageRequest.controller.js";


describe("Controller of QueueOfRequests", () => {
	const messageRequest = new MessageRequest();
  
	test("creates a messageRequest", () => {
		const date = Date.now();

		const expectMessageRequest = {
			FROMID: 234,
			messages: [{
				text: "Hello!",
				timeStamp: date
			}
			],
			requestID: 0
		};

		const testMessageRequest = messageRequest.createMessageRequest({
			senderId: 234,
			text: "Hello!",
			createdAt: date
		});

		expect(testMessageRequest).toEqual(expectMessageRequest);
	});
});