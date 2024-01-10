import { messageRequest } from "../types/messageRequest.type.js";

export interface IQueueOfRequests {
  getRequestsByTOID(TOID: number): messageRequest[] | undefined;

  addRequest(TOID: number, messageRequest: messageRequest): void;

  deleteRequest(TOID: number, FROMID: number, indexMessage: number): void
}