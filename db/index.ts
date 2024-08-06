import Database from "better-sqlite3";
import path from "path";

const filePath = path.join(process.cwd(), "db/words.sqlite");
const db = new Database(filePath, { fileMustExist: true });

export default db;
