"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const PAGE_SIZE_OPTIONS = [12, 24, 48, 96];

export function CatalogToolbar({ count, page, pageSize }: { count: number; page: number; pageSize: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const totalPages = Math.max(1, Math.ceil(count / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);

  function hrefForPage(nextPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(nextPage));
    params.set("page_size", String(pageSize));
    return `${pathname}?${params.toString()}`;
  }

  function onPageSizeChange(nextSize: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page_size", String(nextSize));
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="mb-6 flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-gray-600">
        Page {safePage} of {totalPages}
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="page-size" className="text-sm text-gray-700">
          Per page
        </label>
        <select
          id="page-size"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="rounded border border-gray-300 px-2 py-1 text-sm"
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <button
          type="button"
          disabled={safePage <= 1}
          onClick={() => router.push(hrefForPage(safePage - 1))}
          className="rounded border border-gray-300 px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          Prev
        </button>
        <button
          type="button"
          disabled={safePage >= totalPages}
          onClick={() => router.push(hrefForPage(safePage + 1))}
          className="rounded border border-gray-300 px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
