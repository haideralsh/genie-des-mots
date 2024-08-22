import WordList from "./ResultList";
import ResultHeading from "./ResultHeading";
import db from "@/db";
import { DatabaseResult, mapResult, RESULTS_LIMIT } from "@/db/lib";

interface Props {
  searchTerm: string;
}

export default async function SearchResults({ searchTerm }: Props) {
  const results = db
    .prepare<[string, number], DatabaseResult>(
      `SELECT
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
      LIMIT ?;`,
    )
    .all(`${searchTerm}%`, RESULTS_LIMIT)
    .map(mapResult);

  return (
    <>
      <ResultHeading>
        {results.length > 0
          ? `Mots commençant par « ${searchTerm} »`
          : `Aucun mot trouvé commençant par « ${searchTerm} »`}
      </ResultHeading>
      <WordList searchTerm={searchTerm} results={results} />
      {results.length === RESULTS_LIMIT && (
        <>
          <p className="text-sm text-[#8E8C99]">
            Affichage de {RESULTS_LIMIT} résultats parmi plusieurs
          </p>
        </>
      )}
    </>
  );
}
