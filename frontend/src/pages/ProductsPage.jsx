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
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="pt-10 sm:pt-14 pb-8 sm:pb-10">
        <div className="apple-section-wide">
          <div className="mb-8 sm:mb-10">
            <h1 className="text-[32px] sm:text-[44px] font-bold tracking-[-0.03em] text-[#1D1D1F] leading-tight">
              {filters.category
                ? filters.category.charAt(0).toUpperCase() + filters.category.slice(1)
                : 'All Products'}
            </h1>
            {data && (
              <p className="text-[15px] sm:text-[17px] text-[#86868B] mt-2">
                {data.totalProducts} {data.totalProducts === 1 ? 'product' : 'products'} found
              </p>
            )}
          </div>

          {/* Filters */}
          <ProductFilters filters={filters} onFilterChange={handleFilterChange} />
        </div>
      </section>

      {/* Products Grid */}
      <section className="pb-12 sm:pb-16">
        <div className="apple-section-wide">
          {isError ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-[#F5F5F7] flex items-center justify-center">
                <Package className="w-7 h-7 text-[#86868B]" strokeWidth={1.5} />
              </div>
              <h2 className="text-[21px] font-semibold text-[#1D1D1F] mb-2">Something went wrong</h2>
              <p className="text-[15px] text-[#86868B]">Please try again later.</p>
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
