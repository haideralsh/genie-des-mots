"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";

export default function Input(props: React.ComponentPropsWithoutRef<"input">) {
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
    }

    router.replace(`${pathname}?${params.toString()}`);
  }

  function clear() {
    if (ref.current === null) return;

    ref.current.value = "";

    const params = new URLSearchParams(searchParams);
    params.delete("search");
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

function MagnifyingGlass(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}

function ClearIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm2.78-4.22a.75.75 0 0 1-1.06 0L8 9.06l-1.72 1.72a.75.75 0 1 1-1.06-1.06L6.94 8 5.22 6.28a.75.75 0 0 1 1.06-1.06L8 6.94l1.72-1.72a.75.75 0 1 1 1.06 1.06L9.06 8l1.72 1.72a.75.75 0 0 1 0 1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
