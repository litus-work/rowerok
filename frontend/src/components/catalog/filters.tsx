"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const brands = ["Summit", "Veloce", "Terra", "Volt", "CityLife"];
const frameSizes = ["S", "M", "L", "XL", "54cm", "56cm"];
const wheelSizes = ['26"', '27.5"', '29"', "700c"];
const frameMaterials = ["Carbon", "Aluminum", "Steel"];
const brakeTypes = ["Hydraulic Disc", "Mechanical Disc", "Rim", "V-Brake"];
const forkTypes = ["Air", "Air Suspension 140mm", "Carbon Rigid", "Rigid"];
const gears = ["7", "9", "10", "11", "12", "22"];
const conditions = ["new", "used"];
const availabilities = ["in_stock", "out_of_stock"];

function FilterGroup({ title, values, param }: { title: string; values: string[]; param: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get(param)?.split(",").filter(Boolean) ?? [];

  function toggle(value: string) {
    const set = new Set(current);
    if (set.has(value)) set.delete(value);
    else set.add(value);
    const params = new URLSearchParams(searchParams.toString());
    if (set.size) params.set(param, [...set].join(","));
    else params.delete(param);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div>
      <h3 className="mb-3 font-semibold text-gray-900">{title}</h3>
      <div className="space-y-2">
        {values.map((item) => (
          <label key={item} className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={current.includes(item)} onChange={() => toggle(item)} />
            {item}
          </label>
        ))}
      </div>
    </div>
  );
}

export function CatalogFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const priceMin = searchParams.get("price_min") || "";
  const priceMax = searchParams.get("price_max") || "";

  return (
    <aside className="space-y-6 rounded-xl border border-gray-100 bg-gray-50 p-4">
      <FilterGroup title="Brand" values={brands} param="brand" />
      <FilterGroup title="Frame Size" values={frameSizes} param="frame_size" />
      <FilterGroup title="Wheel Size" values={wheelSizes} param="wheel_size" />
      <FilterGroup title="Frame Material" values={frameMaterials} param="frame_material" />
      <FilterGroup title="Brake Type" values={brakeTypes} param="brake_type" />
      <FilterGroup title="Fork Type" values={forkTypes} param="fork_type" />
      <FilterGroup title="Gears" values={gears} param="gears" />
      <FilterGroup title="Condition" values={conditions} param="condition" />
      <FilterGroup title="Availability" values={availabilities} param="availability" />
      <div>
        <h3 className="mb-3 font-semibold text-gray-900">Price</h3>
        <div className="flex gap-2">
          <input
            defaultValue={priceMin}
            placeholder="Min"
            className="w-full rounded border px-2 py-1 text-sm"
            onBlur={(e) => {
              const params = new URLSearchParams(searchParams.toString());
              if (e.target.value) params.set("price_min", e.target.value);
              else params.delete("price_min");
              router.push(`${pathname}?${params.toString()}`);
            }}
          />
          <input
            defaultValue={priceMax}
            placeholder="Max"
            className="w-full rounded border px-2 py-1 text-sm"
            onBlur={(e) => {
              const params = new URLSearchParams(searchParams.toString());
              if (e.target.value) params.set("price_max", e.target.value);
              else params.delete("price_max");
              router.push(`${pathname}?${params.toString()}`);
            }}
          />
        </div>
      </div>
    </aside>
  );
}
