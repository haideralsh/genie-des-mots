import db from "@/db";
import { revalidatePath } from "next/cache";
import SearchInput from "@/components/ui/SearchInput";
import WordList, { MF, Word } from "@/components/ui/Words";

export default async function Home({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const searchTerm = searchParams.search;

  // @todo fix the search term bug
  console.log("searchTerm", searchTerm);

  let results = [];

  if (searchTerm) {
    results = db
      .prepare<string, Word>(
        "SELECT word, gender FROM words WHERE word LIKE ? LIMIT 10"
      )
      .all(`${searchTerm}%`);
  } else {
    results = db
      .prepare<[], Word>(
        "SELECT word, gender FROM words ORDER BY RANDOM() LIMIT 10"
      )
      .all();
  }

  async function revalidatePage() {
    "use server";
    revalidatePath("/");
  }

  return (
    <main className="flex min-h-screen flex-col gap-4 p-4 max-w-md m-auto">
      <MF />
      <SearchInput />
      {searchTerm ? (
        <>
          <ResultHeading>
            {results.length > 0
              ? `Mots commençant par « ${searchTerm} »`
              : `Aucun mot trouvé commençant par « ${searchTerm} »`}
          </ResultHeading>
          <WordList searchTerm={searchTerm} words={results} />
        </>
      ) : (
        <>
          <form className="flex items-center gap-1 " action={revalidatePage}>
            <ResultHeading>Mots aléatoires</ResultHeading>
            <RandomizeButton />
          </form>
          <WordList words={results} />
        </>
      )}
    </main>
  );
}

function RandomizeButton() {
  return (
    <button className="outline-offset-4 rounded-full text-gray-500">
      <svg
        width="15"
        height="15"
        viewBox="0 0 15 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12.3536 1.14645C12.1583 0.951184 11.8417 0.951184 11.6464 1.14645C11.4512 1.34171 11.4512 1.65829 11.6464 1.85355L12.7929 3H12C10.7037 3 9.71111 3.58423 8.87248 4.38931C8.20065 5.03427 7.59349 5.85684 6.99461 6.6682C6.86287 6.84668 6.73154 7.02462 6.6 7.2C5.10874 9.18835 3.49037 11 0.5 11C0.223858 11 0 11.2239 0 11.5C0 11.7761 0.223858 12 0.5 12C4.00963 12 5.89126 9.81165 7.4 7.8C7.54367 7.60845 7.6832 7.41962 7.81996 7.23454L7.82005 7.23443L7.82006 7.23441C8.41674 6.42695 8.96069 5.69085 9.56502 5.11069C10.2889 4.41577 11.0463 4 12 4H12.7929L11.6464 5.14645C11.4512 5.34171 11.4512 5.65829 11.6464 5.85355C11.8417 6.04882 12.1583 6.04882 12.3536 5.85355L14.3536 3.85355C14.5488 3.65829 14.5488 3.34171 14.3536 3.14645L12.3536 1.14645ZM0.5 3C3.35278 3 5.12992 4.44588 6.50548 6.06746L6.3762 6.24266C6.2483 6.4161 6.12293 6.58609 6 6.75C5.96397 6.79804 5.92798 6.84581 5.892 6.89331C4.57348 5.29306 3.02637 4 0.5 4C0.223858 4 0 3.77614 0 3.5C0 3.22386 0.223858 3 0.5 3ZM8.87248 10.6107C8.37284 10.131 7.90897 9.55314 7.45767 8.95468C7.64688 8.71693 7.82704 8.48061 8 8.25L8.08987 8.12987C8.58412 8.79402 9.05288 9.39766 9.56502 9.88931C10.2889 10.5842 11.0463 11 12 11H12.7929L11.6464 9.85355C11.4512 9.65829 11.4512 9.34171 11.6464 9.14645C11.8417 8.95118 12.1583 8.95118 12.3536 9.14645L14.3536 11.1464C14.5488 11.3417 14.5488 11.6583 14.3536 11.8536L12.3536 13.8536C12.1583 14.0488 11.8417 14.0488 11.6464 13.8536C11.4512 13.6583 11.4512 13.3417 11.6464 13.1464L12.7929 12H12C10.7037 12 9.71111 11.4158 8.87248 10.6107Z"
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
        ></path>
      </svg>
    </button>
  );
}

function ResultHeading(props: { children: string }) {
  return <h2 className="text-sm text-gray-500">{props.children}</h2>;
}
