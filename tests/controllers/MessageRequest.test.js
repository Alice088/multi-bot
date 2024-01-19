import { describe, expect, test } from "@jest/globals";
import { MessageRequest } from "../../dist/server/QueueOfRequests/controllers/MessageRequest.controller.js";


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
			text: "Hello!",
			createdAt: date
		}, 234);

		console.log(testMessageRequest);

		expect(testMessageRequest).toEqual(expectMessageRequest);
	});
});