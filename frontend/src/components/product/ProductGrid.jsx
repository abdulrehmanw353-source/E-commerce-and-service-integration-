import ProductCard from './ProductCard';

/**
 * ProductGrid — Responsive grid layout for ProductCards
 * 
 * 2 cols mobile, 3 cols tablet, 4 cols desktop.
 * Used by ProductsPage and homepage Featured Products section.
 */
export default function ProductGrid({ products = [], loading = false }) {
  // Loading skeleton
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-[20px] bg-[#F5F5F7] animate-pulse">
            <div className="aspect-square bg-[#E8E8ED] rounded-t-[20px]" />
            <div className="p-5 space-y-3">
              <div className="h-3 w-16 bg-[#E8E8ED] rounded-full" />
              <div className="h-4 w-full bg-[#E8E8ED] rounded-full" />
              <div className="h-4 w-2/3 bg-[#E8E8ED] rounded-full" />
              <div className="h-5 w-20 bg-[#E8E8ED] rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (!products.length) {
    return (
      <div className="text-center py-16">
        <p className="text-[17px] text-[#86868B]">No products found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
