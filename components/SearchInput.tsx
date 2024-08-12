"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";
import { ClearIcon, MagnifyingGlass } from "./icons";

export default function Input(
  props: React.ComponentPropsWithoutRef<"input"> & {
    revalidate: () => Promise<void>;
  }
) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const ref = useRef<HTMLInputElement>(null);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const term = event.target.value.toLowerCase().trim();
    const params = new URLSearchParams(searchParams);

    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
      props.revalidate();
    }

    router.replace(`${pathname}?${params.toString()}`);
  }

  function clear() {
    if (ref.current === null) return;

    ref.current.value = "";

    const params = new URLSearchParams(searchParams);
    params.delete("search");
    props.revalidate();
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex items-center relative">
      <input
        ref={ref}
        className="peer pl-9 text-[#53195D] bg-[#F2EFF3] hover:bg-[#EAE7EC] focus:bg-[#E3DFE6] transition-colors placeholder:text-[#8E8C99] rounded-md focus-visible:border-neutral-500 p-2 w-full outline-none"
        type={props.type}
        placeholder={props.placeholder}
        onChange={handleChange}
        defaultValue={searchParams.get("search")?.toString()}
      />
      <MagnifyingGlass className="absolute size-5 left-2 text-[#53195D] peer-placeholder-shown:text-[#8E8C99] transition-colors" />
      <button
        onClick={clear}
        className="absolute right-2 text-[#D0CDD7] peer-focus:text-[#8E8C99] peer-placeholder-shown:hidden transition-colors cursor-default"
      >
        <ClearIcon className="size-5" />
      </button>
    </div>
  );
}
