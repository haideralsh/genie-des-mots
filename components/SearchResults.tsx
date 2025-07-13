import WordList from "./ResultList";
import ResultHeading from "./ResultHeading";
import { searchWords, RESULTS_LIMIT } from "@/db/lib";

interface Props {
  searchTerm: string;
}

export default async function SearchResults({ searchTerm }: Props) {
  const results = await searchWords(searchTerm);

  return (
    <>
      <ResultHeading>
        {results.length > 0
          ? `Mots commençant par « ${searchTerm} »`
          : `Aucun mot trouvé commençant par « ${searchTerm} »`}
      </ResultHeading>
      <WordList searchTerm={searchTerm} results={results} />
      {results.length === RESULTS_LIMIT && (
        <p className="text-sm text-[#8E8C99]">
          Affichage de {RESULTS_LIMIT} résultats parmi plusieurs
        </p>
      )}
    </>
  );
}
