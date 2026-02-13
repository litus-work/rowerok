import { ProductCard } from "@/components/catalog/product-card";
import HeroBanner from "@/components/home/hero-banner";
import { getProducts } from "@/lib/api";

export default async function HomePage() {
  const products = await getProducts();
  const featured = products.results.slice(0, 4);

  return (
    <div className="space-y-16 pb-16">
      <HeroBanner />
      <section className="container mx-auto px-4">
        <h2 className="mb-6 text-3xl font-bold">Featured Bikes</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
