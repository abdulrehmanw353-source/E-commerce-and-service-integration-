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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-[24px] bg-[#F5F5F7] animate-pulse border border-[#E8E8ED]">
            <div className="aspect-square bg-[#E8E8ED] rounded-t-[24px]" />
            <div className="p-5 space-y-3">
              <div className="h-3 w-16 bg-[#D2D2D7] rounded-full" />
              <div className="h-4 w-full bg-[#D2D2D7] rounded-full" />
              <div className="h-4 w-2/3 bg-[#D2D2D7] rounded-full" />
              <div className="h-5 w-20 bg-[#D2D2D7] rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (!products.length) {
    return (
      <div className="text-center py-24 sm:py-32 bg-[#F5F5F7] rounded-[32px] border border-[#E8E8ED]">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex items-center justify-center">
          <svg className="w-8 h-8 text-[#86868B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
        <h3 className="text-[24px] font-semibold text-[#1D1D1F] mb-2 tracking-[-0.01em]">No products found</h3>
        <p className="text-[17px] text-[#86868B] max-w-[300px] mx-auto">Try adjusting your filters or search terms to find what you're looking for.</p>
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
