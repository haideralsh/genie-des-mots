import SearchInput from "@/components/SearchInput";
import SearchResults from "@/components/SearchResults";
import Logo from "@/components/Logo";
import DefaultResults from "@/components/DefaultResults";
import { revalidatePath } from "next/cache";

export default async function Home({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const searchTerm = searchParams.search;

  async function revalidate() {
    "use server";
    revalidatePath("/");
  }

  return (
    <div className="max-w-5xl mx-auto p-4 flex flex-col md:flex-row gap-5 md:pt-10">
      <div className="md:w-1/3 md:mb-0 space-y-4">
        <Logo />
        <SearchInput
          revalidate={revalidate}
          placeholder="Rechercher un mot..."
        />
      </div>
      <main className="md:w-2/3 bg-[#FDFCFD] p-4 rounded-2xl shadow-2xl shadow-[#DBD8E0] text-[#402060]">
        <div className="space-y-2">
          {searchTerm ? (
            <SearchResults searchTerm={searchTerm} />
          ) : (
            <DefaultResults />
          )}
        </div>
      </main>
    </div>
  );
}
