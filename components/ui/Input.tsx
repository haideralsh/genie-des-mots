"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export default function Input(props: React.ComponentPropsWithoutRef<"input">) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;

    router.push(pathname + "?" + createQueryString("search", value));
  }

  return (
    <input
      className="border-2 border-gray-300 p-2 rounded-md w-full"
      type={props.type}
      placeholder={props.placeholder}
      value={props.value}
      onChange={handleChange}
    />
  );
}
