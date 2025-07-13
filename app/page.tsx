import SearchInput from "@/components/SearchInput";
import SearchResults from "@/components/SearchResults";
import DefaultResultsLoader from "@/components/DefaultResultsLoader";
import { Suspense } from "react";
import { LoadingState } from "@/components/LoadingState";
import { Logo } from "@/components/svgs";

export default async function Home(props: {
  searchParams: Promise<{ search?: string }>;
}) {
  const searchParams = await props.searchParams;
  const searchTerm = searchParams.search;

  return (
    <div className="max-w-5xl mx-auto p-4 flex flex-col md:flex-row gap-5 md:pt-10">
      <div className="md:w-1/3 md:mb-0 space-y-4">
        <Logo />
        <SearchInput placeholder="Rechercher un mot..." />
      </div>
      <main className="md:w-2/3 bg-[#FDFCFD] p-4 rounded-2xl shadow-2xl shadow-[#DBD8E0] text-[#402060]">
        <div className="space-y-2">
          <Suspense key={searchTerm || "default"} fallback={<LoadingState />}>
            {searchTerm ? (
              <SearchResults searchTerm={searchTerm} />
            ) : (
              <DefaultResultsLoader />
            )}
          </Suspense>
        </div>
      </main>
    </div>
  );
}
