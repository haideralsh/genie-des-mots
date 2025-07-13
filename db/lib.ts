import db from "./index";

export const RESULTS_LIMIT = 12;

export interface DatabaseResult {
  word: string;
  properties: string;
  types: string;
}

export interface Result {
  readonly word: string;
  readonly isMasculine: boolean;
  readonly isFeminine: boolean;
  readonly isSingular: boolean;
  readonly isPlural: boolean;
  readonly isNoun: boolean;
  readonly isAdjective: boolean;
}

export function mapResult(result: DatabaseResult): Result {
  return {
    word: result.word,
    isMasculine: result.properties?.includes("masculin") || false,
    isFeminine: result.properties?.includes("féminin") || false,
    isSingular: result.properties?.includes("singulier") || false,
    isPlural: result.properties?.includes("pluriel") || false,
    isNoun: result.types?.includes("Noms communs") || false,
    isAdjective: result.types?.includes("Adjectifs") || false,
  };
}

const searchStatement = db.prepare<[string, number], DatabaseResult>(`
  SELECT
    w.word,
    GROUP_CONCAT(DISTINCT p.name) AS properties,
    GROUP_CONCAT(DISTINCT wt.name) as types
  FROM
    WORDS w
        LEFT JOIN
    WORD_PROPERTIES wp ON w.id = wp.word_id
        LEFT JOIN
    PROPERTIES p ON wp.property_id = p.id
        LEFT JOIN
    WORD_TYPE_ASSIGNMENTS wta ON w.id = wta.word_id
        LEFT JOIN
    WORD_TYPES wt ON wta.word_type_id = wt.id
  WHERE
      w.word LIKE ?
  GROUP BY
      w.word
  ORDER BY
      w.word
  LIMIT ?;
`);

const randomStatement = db.prepare<[number], DatabaseResult>(`
  SELECT
        w.word,
        GROUP_CONCAT(DISTINCT p.name) AS properties,
        GROUP_CONCAT(DISTINCT wt.name) as types
  FROM
      WORDS w
          LEFT JOIN
      WORD_PROPERTIES wp ON w.id = wp.word_id
          LEFT JOIN
      PROPERTIES p ON wp.property_id = p.id
          LEFT JOIN
      WORD_TYPE_ASSIGNMENTS wta ON w.id = wta.word_id
          LEFT JOIN
      WORD_TYPES wt ON wta.word_type_id = wt.id
  GROUP BY
      w.word
  ORDER BY
      RANDOM()
  LIMIT ?;
`);

export async function searchWords(searchTerm: string): Promise<Result[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const results = searchStatement
        .all(`${searchTerm}%`, RESULTS_LIMIT)
        .map(mapResult);
      resolve(results);
    }, 100);
  });
}

export async function getRandomWords(): Promise<Result[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const results = randomStatement.all(RESULTS_LIMIT).map(mapResult);

      resolve(results);
    }, 100);
  });
}
