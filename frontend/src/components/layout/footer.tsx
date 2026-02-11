export function Footer() {
  return (
    <footer className="mt-16 bg-gray-900 py-12 text-gray-300">
      <div className="container mx-auto grid gap-10 px-4 md:grid-cols-4">
        <div>
          <h3 className="text-xl font-bold text-white">
            ROWER <span className="text-brand">OK</span>
          </h3>
          <p className="mt-4 text-sm text-gray-400">Премiум велосипеди для мiста, шосе та трейлiв.</p>
        </div>
        <div>
          <h4 className="mb-3 font-semibold text-white">Shop</h4>
          <ul className="space-y-2 text-sm">
            <li>MTB</li>
            <li>Road</li>
            <li>Gravel</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-semibold text-white">Support</h4>
          <ul className="space-y-2 text-sm">
            <li>Delivery</li>
            <li>Warranty</li>
            <li>Service</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-semibold text-white">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li>Kyiv, Ukraine</li>
            <li>+380 44 123 45 67</li>
            <li>hello@rowerok.ua</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
