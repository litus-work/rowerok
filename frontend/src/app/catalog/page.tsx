import { CatalogFilters } from "@/components/catalog/filters";
import { ProductCard } from "@/components/catalog/product-card";
import { getProducts } from "@/lib/api";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CatalogPage({ searchParams }: Props) {
  const paramsObj = await searchParams;
  const params = new URLSearchParams();
  Object.entries(paramsObj).forEach(([k, v]) => {
    if (typeof v === "string") params.set(k, v);
  });
  const data = await getProducts(params);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">All Bicycles</h1>
        <p className="text-gray-500">Showing {data.count} results</p>
      </div>
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <CatalogFilters />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {data.results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
