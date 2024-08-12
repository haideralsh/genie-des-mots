import {
  FIcon,
  MFIcon,
  AdjIcon,
  MIcon,
  NomIcon,
  NomOuAdjIcon,
  PIcon,
  SIcon,
  SOuPIcon,
} from "@/components/icons";
import { Result } from "@/db";
import { Libre_Baskerville } from "next/font/google";

interface Props {
  results: Result[];
  searchTerm?: string;
}

const libre = Libre_Baskerville({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export default function ResultList(props: Props) {
  return (
    <div className={`flex flex-col ${libre.className}`}>
      {props.results.map((result) => {
        const word = result.word;

        return (
          <div
            key={word}
            className={`flex text-lg justify-between items-center border-b last:border-none py-3 border-[#EAE7EC]`}
          >
            <span>
              {props.searchTerm && (
                <span className="font-bold underline underline-offset-2 decoration-[#D0CDD7]">
                  {word.substring(0, props.searchTerm.length)}
                </span>
              )}
              <span className="lowercase">
                {props.searchTerm
                  ? word.substring(props.searchTerm.length)
                  : word}
              </span>
            </span>
            <div className="flex gap-1.5">
              {/* Word Type  */}
              {result.isAdjective && result.isNoun ? (
                <NomOuAdjIcon />
              ) : result.isAdjective ? (
                <AdjIcon />
              ) : result.isNoun ? (
                <NomIcon />
              ) : null}

              {/* Word Gender */}
              {result.isMasculine && result.isFeminine ? (
                <MFIcon />
              ) : result.isMasculine ? (
                <MIcon />
              ) : result.isFeminine ? (
                <FIcon />
              ) : null}

              {/* Word Number */}
              {result.isSingular && result.isPlural ? (
                <SOuPIcon />
              ) : result.isSingular ? (
                <SIcon />
              ) : result.isPlural ? (
                <PIcon />
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
