import { CatalogToolbar } from "@/components/catalog/catalog-toolbar";
import { CatalogFilters } from "@/components/catalog/filters";
import { ProductCard } from "@/components/catalog/product-card";
import { getCategoryProducts } from "@/lib/api";

type Props = {
  params: Promise<{ category: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category } = await params;
  const paramsObj = await searchParams;
  const query = new URLSearchParams();
  Object.entries(paramsObj).forEach(([k, v]) => {
    if (typeof v === "string") query.set(k, v);
  });
  const page = Math.max(1, Number(query.get("page") || "1"));
  const pageSize = Math.max(1, Number(query.get("page_size") || "24"));
  query.set("page", String(page));
  query.set("page_size", String(pageSize));
  const data = await getCategoryProducts(category, query);
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold capitalize">{category}</h1>
        <p className="text-gray-500">Showing {data.count} results</p>
      </div>
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <CatalogFilters />
        <div>
          <CatalogToolbar count={data.count} page={page} pageSize={pageSize} />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {data.results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-6">
            <CatalogToolbar count={data.count} page={page} pageSize={pageSize} />
          </div>
        </div>
      </div>
    </div>
  );
}
