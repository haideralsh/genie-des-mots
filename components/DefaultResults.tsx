"use client";

import { RandomizeIcon } from "./svgs";
import ResultHeading from "./ResultHeading";
import ResultList from "./ResultList";
import type { Result } from "@/db/lib";
import { useTransition, useState } from "react";

interface DefaultResultsProps {
  initialResults: Result[];
  refreshAction: () => Promise<Result[]>;
}

export default function DefaultResults({
  initialResults,
  refreshAction,
}: DefaultResultsProps) {
  const [results, setResults] = useState<Result[]>(initialResults);
  const [isPending, startTransition] = useTransition();

  const handleRefresh = () => {
    startTransition(async () => {
      const newResults = await refreshAction();
      setResults(newResults);
    });
  };

  return (
    <>
      <form action={handleRefresh}>
        <div className="flex items-center gap-2">
          <ResultHeading>Mots aléatoires</ResultHeading>
          <button
            type="submit"
            disabled={isPending}
            className="transition-colors rounded-full hover:bg-[#EAE7EC] hover:text-[#53195D] text-[#8E8C99] p-1.5 -m-1.5 disabled:opacity-50"
          >
            <RandomizeIcon />
          </button>
        </div>
      </form>
      <div className={isPending ? "opacity-50 transition-opacity" : ""}>
        <ResultList results={results} />
      </div>
    </>
  );
}
