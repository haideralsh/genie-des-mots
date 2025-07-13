import { getRandomWords } from "@/db/lib";
import DefaultResults from "./DefaultResults";

export default async function DefaultResultsLoader() {
  const initialResults = await getRandomWords();

  async function refreshRandomWords() {
    "use server";
    return await getRandomWords();
  }

  return (
    <DefaultResults
      initialResults={initialResults}
      refreshAction={refreshRandomWords}
    />
  );
}
