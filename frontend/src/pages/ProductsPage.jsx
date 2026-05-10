import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Package } from 'lucide-react';

import { useProducts } from '../hooks/useProducts';
import ProductGrid from '../components/product/ProductGrid';
import ProductFilters from '../components/product/ProductFilters';
import Pagination from '../components/ui/Pagination';

/**
 * ProductsPage — Browse all products with search, filter, sort, pagination
 */
export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    category: searchParams.get('category') || '',
    sort: searchParams.get('sort') || '-createdAt',
    page: Number(searchParams.get('page')) || 1,
    limit: 12,
  });

  const { data, isLoading, isError } = useProducts(filters);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    // Sync URL params
    const params = new URLSearchParams();
    if (newFilters.keyword) params.set('keyword', newFilters.keyword);
    if (newFilters.category) params.set('category', newFilters.category);
    if (newFilters.sort && newFilters.sort !== '-createdAt') params.set('sort', newFilters.sort);
    if (newFilters.page > 1) params.set('page', String(newFilters.page));
    setSearchParams(params, { replace: true });
  };

  const handlePageChange = (page) => {
    handleFilterChange({ ...filters, page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="pt-8 sm:pt-12 pb-6 sm:pb-8">
        <div className="apple-section-wide">
          <div className="mb-6 sm:mb-8 text-center sm:text-left">
            <h1 className="text-[32px] sm:text-[52px] font-extrabold tracking-[-0.03em] text-white leading-tight mb-2">
              {filters.category
                ? filters.category.charAt(0).toUpperCase() + filters.category.slice(1)
                : 'All Products.'}
            </h1>
            {data && (
              <p className="text-[13px] sm:text-[14px] text-white/50 font-medium">
                {data.totalProducts} {data.totalProducts === 1 ? 'product' : 'products'} found
              </p>
            )}
          </div>

          {/* Filters */}
          <ProductFilters filters={filters} onFilterChange={handleFilterChange} />
        </div>
      </section>

      {/* Products Grid */}
      <section className="pb-8 sm:pb-12">
        <div className="apple-section-wide">
          {isError ? (
            <div className="text-center py-20 ds-card">
              <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center">
                <Package className="w-7 h-7 text-white/35" strokeWidth={1.5} />
              </div>
              <h2 className="text-[18px] font-semibold text-white mb-2">Something went wrong</h2>
              <p className="text-[13px] text-white/45">Please try again later.</p>
            </div>
          ) : (
            <>
              <ProductGrid products={data?.products || []} loading={isLoading} />

              {data && data.totalPages > 1 && (
                <Pagination
                  currentPage={data.page}
                  totalPages={data.totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
