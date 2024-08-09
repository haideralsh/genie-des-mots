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
import { Libre_Baskerville } from "next/font/google";

export interface Word {
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

interface Props {
  words: Word[];
  searchTerm?: string;
}

const libre = Libre_Baskerville({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export default function WordList(props: Props) {
  return (
    <div className={`flex flex-col ${libre.className}`}>
      {props.words.map((result) => {
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
              <span>
                <WordType result={result} />
              </span>
              <span>
                <WordGender result={result} />
              </span>

              <span>
                <WordNumber result={result} />
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function WordType({ result }: { result: Word }) {
  if (result.isAdjective && result.isNoun) return <NomOuAdjIcon />;
  if (result.isAdjective) return <AdjIcon />;
  if (result.isNoun) return <NomIcon />;
}

function WordGender({ result }: { result: Word }) {
  if (result.isMasculine && result.isFeminine) return <MFIcon />;
  if (result.isMasculine) return <MIcon />;
  if (result.isFeminine) return <FIcon />;
}

function WordNumber({ result }: { result: Word }) {
  if (result.isSingular && result.isPlural) return <SOuPIcon />;
  if (result.isSingular) return <SIcon />;
  if (result.isPlural) return <PIcon />;
}
