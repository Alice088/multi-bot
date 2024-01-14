import "./modules.js";
import { MessageRequest } from "./dist/controllers/MessageRequest.controller.js";
import { QueueOfRequests } from "./dist/controllers/QueueOfRequests.controller.js";

export const queueOfRequests = new QueueOfRequests();
export const messageRequest = new MessageRequest();