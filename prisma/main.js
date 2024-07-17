import Database from "better-sqlite3";
const db = new Database("words.db", { fileMustExist: true });

const row = db
  .prepare(
    "SELECT count(Word.word) as count FROM Word JOIN Gender on Word.gender_id = Gender.id WHERE gender_id in (1,2);",
  )
  .all();

console.log(row);
