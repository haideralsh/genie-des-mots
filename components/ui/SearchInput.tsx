"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function Input(props: React.ComponentPropsWithoutRef<"input">) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const term = event.target.value;
    const params = new URLSearchParams(searchParams);

    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }

    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <input
      className="border border-neutral-300 bg-neutral-100 rounded focus-visible:border-neutral-500 p-2 w-full outline-none"
      type={props.type}
      placeholder={props.placeholder}
      onChange={handleChange}
      defaultValue={searchParams.get("search")?.toString()}
    />
  );
}
