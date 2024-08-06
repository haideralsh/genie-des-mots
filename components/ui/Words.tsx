import FIcon from "@/icons/f";
import MFIcon from "@/icons/m-f";
import MIcon from "@/icons/m";

export interface Word {
  readonly word: string;
  readonly properties: string[];
  readonly types: string[];
}

interface Props {
  words: Word[];
  searchTerm?: string;
}

export default function WordList(props: Props) {
  return (
    <div className="flex flex-col">
      {props.words.map(({ word, properties, types }) => {
        const isMasculine = properties.includes("masculin");
        const isFeminine = properties.includes("féminin");

        const isSingular = properties.includes("singulier");
        const isPlural = properties.includes("pluriel");

        return (
          <div
            key={word}
            className={`flex text-lg justify-between items-center border-b last:border-none py-4 border-[#EAE7EC]`}
          >
            <span>
              {props.searchTerm && (
                <span className="font-semibold underline underline-offset-2 decoration-[#D0CDD7]">
                  {word.substring(0, props.searchTerm.length)}
                </span>
              )}
              <span className="lowercase">
                {props.searchTerm
                  ? word.substring(props.searchTerm.length)
                  : word}
              </span>
            </span>
            <div className="flex gap-2">
              <span>
                {isMasculine && isFeminine ? (
                  <MFIcon className="w-12 h-6" />
                ) : isMasculine ? (
                  <MIcon className="w-6 h-6" />
                ) : (
                  <FIcon className="w-6 h-6" />
                )}
              </span>

              {/* <span>{isSingular ? "S" : isPlural ? "P" : "SP"}</span> */}
            </div>
          </div>
        );
      })}
    </div>
  );
}
