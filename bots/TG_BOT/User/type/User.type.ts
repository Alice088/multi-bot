import * as mysql2 from "mysql2/promise";

export type User = {
  row_id: number,
  saved_people: mysql2.RowDataPacket
}