import { messageRequest } from "../types/messageRequest.type.ts";

export interface IQueueOfRequests {
  getRequestsByTOID(TOID: number): messageRequest[] | undefined;

  addRequest(TOID: number, ...messageRequest: messageRequest[]): void;
}