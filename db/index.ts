import Database from "better-sqlite3";
import path from "path";

export interface DatabaseResult {
  word: string;
  properties: string;
  types: string;
}

export interface Result {
  readonly word: string;

  // None of these are mutually exclusive,
  // which is why they are all booleans
  readonly isMasculine: boolean;
  readonly isFeminine: boolean;
  readonly isSingular: boolean;
  readonly isPlural: boolean;
  readonly isNoun: boolean;
  readonly isAdjective: boolean;
}

export const RESULTS_LIMIT = 12;

export function processResults(result: DatabaseResult): Result {
  return {
    word: result.word,
    isMasculine: result.properties.includes("masculin"),
    isFeminine: result.properties.includes("féminin"),
    isSingular: result.properties.includes("singulier"),
    isPlural: result.properties.includes("pluriel"),
    isNoun: result.types.includes("Noms communs"),
    isAdjective: result.types.includes("Adjectifs"),
  };
}

const filePath = path.join(process.cwd(), "db/words.sqlite");
const db = new Database(filePath, { fileMustExist: true });

export default db;
