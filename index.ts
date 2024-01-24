import "./modules.js";

import { MessageRequest } from "./server/QueueOfRequests/controllers/MessageRequest.controller.js";
import { QueueOfRequests } from "./server/QueueOfRequests/controllers/QueueOfRequests.controller.js";

export const queueOfRequests = new QueueOfRequests();
export const messageRequest = new MessageRequest();