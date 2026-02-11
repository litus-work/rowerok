import { ProductCard } from "@/components/catalog/product-card";
import { getProducts } from "@/lib/api";

export default async function HomePage() {
  const products = await getProducts();
  const featured = products.results.slice(0, 4);
  return (
    <div className="space-y-16 pb-16">
      <section className="relative h-[540px] overflow-hidden bg-gray-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#fb923c_0,#111827_45%)] opacity-70" />
        <div className="container relative z-10 mx-auto px-4 py-24">
          <h1 className="text-5xl font-bold leading-tight text-white md:text-7xl">
            Find Your <span className="text-orange-500">Perfect Ride</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-gray-200">Пiдбiр велосипедiв для мiста, трейлу та шосе.</p>
        </div>
      </section>
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
