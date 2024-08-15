import { DatabaseResult, mapResult, RESULTS_LIMIT } from "@/db/lib";
import db from "@/db";
import { RandomizeIcon } from "./icons";
import ResultHeading from "./ResultHeading";
import ResultList from "./ResultList";
import { revalidatePath } from "next/cache";

export default function DefaultResults() {
  async function revalidatePage() {
    "use server";
    revalidatePath("/");
  }

  const results = db
    .prepare<[number], DatabaseResult>(
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
      GROUP BY
          w.word
      ORDER BY
          RANDOM()
      LIMIT ?;`,
    )
    .all(RESULTS_LIMIT)
    .map(mapResult);

  return (
    <>
      <form action={revalidatePage}>
        <div className="flex items-center gap-2">
          <ResultHeading>Mots aléatoires</ResultHeading>
          <button className="transition-colors rounded-full hover:bg-[#EAE7EC] hover:text-[#53195D] text-[#8E8C99] p-1.5 -m-1.5 ">
            <RandomizeIcon />
          </button>
        </div>
      </form>
      <ResultList results={results} />
    </>
  );
}
