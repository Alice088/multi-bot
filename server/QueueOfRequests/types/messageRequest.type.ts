export type messageRequest = {
  readonly FROMID: number,
  readonly TOID: number,
  text: string[],
  readonly timeStamp: number
}