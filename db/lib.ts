export const RESULTS_LIMIT = 12;

export interface DatabaseResult {
  word: string;
  properties: string;
  types: string;
}

// None of the properties are mutually exclusive,
// which is why they are all booleans
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
    isMasculine: result.properties.includes("masculin"),
    isFeminine: result.properties.includes("féminin"),
    isSingular: result.properties.includes("singulier"),
    isPlural: result.properties.includes("pluriel"),
    isNoun: result.types.includes("Noms communs"),
    isAdjective: result.types.includes("Adjectifs"),
  };
}
