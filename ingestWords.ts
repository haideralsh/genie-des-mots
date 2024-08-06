import { Database } from "bun:sqlite";
import { readFile } from "fs/promises";

const db = new Database("words.sqlite");

type RowId = number | bigint;

interface Attributes {
  propertyIds: RowId[];
  typeId: RowId;
}

function createTables() {
  db.run(`
    CREATE TABLE IF NOT EXISTS WORDS (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      word TEXT UNIQUE NOT NULL
    );`);

  db.run(`CREATE TABLE IF NOT EXISTS PROPERTIES (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL
      );`);

  db.run(`CREATE TABLE IF NOT EXISTS WORD_PROPERTIES (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      word_id INTEGER,
      property_id INTEGER,
      FOREIGN KEY (word_id) REFERENCES WORDS(id),
      FOREIGN KEY (property_id) REFERENCES PROPERTIES(id)
      );`);

  db.run(`CREATE TABLE IF NOT EXISTS WORD_TYPES (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL
    );`);

  db.run(`CREATE TABLE IF NOT EXISTS WORD_TYPE_ASSIGNMENTS (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      word_id INTEGER,
      word_type_id INTEGER,
      FOREIGN KEY (word_id) REFERENCES WORDS(id),
      FOREIGN KEY (word_type_id) REFERENCES WORD_TYPES(id)
      );`);
}

const insertWord = db.transaction(
  (word: string, propertyIds: RowId[], typeId: RowId) => {
    console.log("inserting word", word);

    const wordResult = db
      .prepare("INSERT OR IGNORE INTO WORDS (word) VALUES (?)")
      .run(word);

    const wordId =
      wordResult.changes > 0
        ? wordResult.lastInsertRowid
        : db
            .prepare<
              { id: RowId },
              string
            >("SELECT id FROM WORDS WHERE word = ?")
            .get(word)!.id;

    const existingType = db
      .prepare<
        { id: RowId },
        { wordId: RowId; typeId: RowId }
      >("SELECT id FROM WORD_TYPE_ASSIGNMENTS WHERE word_id = ? AND word_type_id = ?")
      .get({ wordId, typeId });

    if (!existingType) {
      console.log("inserting missing type");
      db.prepare(
        "INSERT INTO WORD_TYPE_ASSIGNMENTS (word_id, word_type_id) VALUES (?, ?)",
      ).run(wordId, typeId);
    }

    propertyIds.forEach((propertyId) => {
      const existingProperty = db
        .prepare<
          { id: RowId },
          { wordId: RowId; propertyId: RowId }
        >("SELECT id FROM WORD_PROPERTIES WHERE word_id = ? AND property_id = ?")
        .get({ wordId, propertyId });

      if (!existingProperty) {
        console.log("inserting missing property");
        db.prepare(
          "INSERT INTO WORD_PROPERTIES (word_id, property_id) VALUES (?, ?)",
        ).run(wordId, propertyId);
      }
    });
  },
);

const processFile = async (content: string, attributes: Attributes) => {
  const words = JSON.parse(content);
  const { propertyIds, typeId } = attributes;

  words.forEach((word: string) => {
    insertWord(word, propertyIds, typeId);
  });
};
const main = async () => {
  createTables();

  const files = [
    "Adjectifs, féminin pluriel (simplifié).json",
    "Adjectifs, féminin singulier (simplifié).json",
    "Adjectifs, masculin pluriel (simplifié).json",
    "Adjectifs, masculin singulier (simplifié).json",
    "Noms communs, féminin pluriel (simplifié).json",
    "Noms communs, féminin singulier (simplifié).json",
    "Noms communs, masculin pluriel (simplifié).json",
    "Noms communs, masculin singulier (simplifié).json",
  ];

  for (const fileName of files) {
    const content = await readFile(fileName, "utf-8");

    const { properties, type } = parseMetadata(fileName);

    console.log({ properties, type });

    const propertyStmt = db.prepare(
      "INSERT OR IGNORE INTO PROPERTIES (name) VALUES (?)",
    );

    const propertyIds = properties.map((property) => {
      const transaction = propertyStmt.run(property);

      if (transaction.changes > 0) {
        console.log("Inserted property", property);
        return transaction.lastInsertRowid;
      } else {
        console.log("property found", property);
        return db
          .prepare<
            { id: number },
            string
          >("SELECT id FROM PROPERTIES WHERE name = ?")
          .get(property)!.id;
      }
    });

    const typeStmt = db.prepare(
      "INSERT OR IGNORE INTO WORD_TYPES (name) VALUES (?)",
    );

    const transaction = typeStmt.run(type);

    const typeId =
      transaction.changes > 0
        ? transaction.lastInsertRowid
        : db
            .prepare<
              { id: number },
              string
            >("SELECT id FROM WORD_TYPES WHERE name = ?")
            .get(type)!.id;

    await processFile(content, { propertyIds, typeId });
  }
};

export function parseMetadata(fileName: string) {
  const [type, properties] = fileName.split(", ");
  return {
    type,
    properties: properties
      .split(" (")[0]
      .split(" ")
      .map((p) => p.trim()),
  };
}

main().catch(console.error);
