"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

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
      className="border-2 border-gray-300 p-2 rounded-md w-full"
      type={props.type}
      placeholder={props.placeholder}
      onChange={handleChange}
      defaultValue={searchParams.get("search")?.toString()}
    />
  );
}
