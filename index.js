import "./modules.js";

import { MessageRequest } from "./dist/server/QueueOfRequests/controllers/MessageRequest.controller.js";
import { QueueOfRequests } from "./dist/server/QueueOfRequests/controllers/QueueOfRequests.controller.js";

export const queueOfRequests = new QueueOfRequests();
export const messageRequest = new MessageRequest();