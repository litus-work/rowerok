import { ProductCard } from "@/components/catalog/product-card";
import ProductGallery from "@/components/product/product-gallery";
import ProductPurchaseActions from "@/components/product/purchase-actions";
import { getProduct, getProducts } from "@/lib/api";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return notFound();
  const related = (await getProducts(new URLSearchParams({ category: String(product.category.id) }))).results
    .filter((x) => x.id !== product.id)
    .slice(0, 4);

  return (
    <div className="container mx-auto space-y-16 px-4 py-8">
      <div className="grid gap-12 lg:grid-cols-2">
        <ProductGallery images={product.images} productName={product.name_en} />
        <div className="space-y-5">
          <div className="text-sm font-semibold uppercase tracking-wide text-brand">{product.brand}</div>
          <h1 className="text-4xl font-bold">{product.name_uk}</h1>
          <div className="text-3xl font-bold">${Number(product.price).toLocaleString()}</div>
          <p className="text-gray-600">{product.description_uk}</p>
          <ProductPurchaseActions product={product} />
          <div className="rounded-xl bg-gray-50 p-5">
            <h3 className="mb-3 font-bold">Technical Specifications</h3>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <span className="text-gray-500">Frame Size</span>
              <span>{product.frame_size}</span>
              <span className="text-gray-500">Wheel Size</span>
              <span>{product.wheel_size}</span>
              <span className="text-gray-500">Material</span>
              <span>{product.frame_material}</span>
              <span className="text-gray-500">Brake Type</span>
              <span>{product.brake_type}</span>
              <span className="text-gray-500">Fork Type</span>
              <span>{product.fork_type}</span>
              <span className="text-gray-500">Gears</span>
              <span>{product.gears}</span>
            </div>
          </div>
        </div>
      </div>
      <section>
        <h2 className="mb-6 text-2xl font-bold">Related Products</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
