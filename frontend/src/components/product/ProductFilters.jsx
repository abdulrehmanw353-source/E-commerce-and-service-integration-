import { Search, SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import { useState } from 'react';

const categories = [
  { label: 'All Categories', value: '' },
  { label: 'Laptops', value: 'laptops' },
  { label: 'Phones', value: 'phones' },
  { label: 'Desktops', value: 'desktops' },
  { label: 'Tablets', value: 'tablets' },
  { label: 'Audio', value: 'audio' },
  { label: 'Gaming', value: 'gaming' },
];

const sortOptions = [
  { label: 'Newest', value: '-createdAt' },
  { label: 'Price: Low to High', value: 'price' },
  { label: 'Price: High to Low', value: '-price' },
  { label: 'Top Rated', value: '-ratings' },
];

/**
 * ProductFilters — Search, category, sort controls
 */
export default function ProductFilters({ filters, onFilterChange }) {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      onFilterChange({ ...filters, keyword: e.target.value.trim(), page: 1 });
    }
  };

  const clearSearch = () => {
    onFilterChange({ ...filters, keyword: '', page: 1 });
  };

  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#86868B]" strokeWidth={1.5} />
          <input
            type="text"
            placeholder="Search products..."
            defaultValue={filters.keyword || ''}
            onKeyDown={handleSearch}
            className="w-full pl-10 pr-10 py-3 bg-[#F5F5F7] rounded-xl text-[15px] text-[#1D1D1F] placeholder:text-[#C7C7CC] outline-none focus:ring-[3px] focus:ring-apple-blue/15 focus:bg-white transition-all border border-transparent focus:border-apple-blue"
          />
          {filters.keyword && (
            <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-[#C7C7CC] hover:text-[#86868B] transition-colors">
              <X className="w-4 h-4" strokeWidth={2} />
            </button>
          )}
        </div>

        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="sm:hidden w-11 h-11 rounded-xl bg-[#F5F5F7] flex items-center justify-center text-[#1D1D1F] hover:bg-[#E8E8ED] transition-colors"
        >
          <SlidersHorizontal className="w-[18px] h-[18px]" strokeWidth={1.5} />
        </button>

        {/* Desktop Filters */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Category */}
          <div className="relative">
            <select
              value={filters.category || ''}
              onChange={(e) => onFilterChange({ ...filters, category: e.target.value, page: 1 })}
              className="appearance-none pl-4 pr-9 py-3 bg-[#F5F5F7] rounded-xl text-[14px] text-[#1D1D1F] outline-none focus:ring-[3px] focus:ring-apple-blue/15 cursor-pointer hover:bg-[#E8E8ED] transition-colors border border-transparent focus:border-apple-blue"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#86868B] pointer-events-none" strokeWidth={2} />
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={filters.sort || '-createdAt'}
              onChange={(e) => onFilterChange({ ...filters, sort: e.target.value, page: 1 })}
              className="appearance-none pl-4 pr-9 py-3 bg-[#F5F5F7] rounded-xl text-[14px] text-[#1D1D1F] outline-none focus:ring-[3px] focus:ring-apple-blue/15 cursor-pointer hover:bg-[#E8E8ED] transition-colors border border-transparent focus:border-apple-blue"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#86868B] pointer-events-none" strokeWidth={2} />
          </div>
        </div>
      </div>

      {/* Mobile Filters Expand */}
      {showMobileFilters && (
        <div className="sm:hidden flex gap-3 animate-fade-in">
          <div className="relative flex-1">
            <select
              value={filters.category || ''}
              onChange={(e) => onFilterChange({ ...filters, category: e.target.value, page: 1 })}
              className="w-full appearance-none pl-4 pr-9 py-3 bg-[#F5F5F7] rounded-xl text-[14px] text-[#1D1D1F] outline-none border border-transparent focus:border-apple-blue"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#86868B] pointer-events-none" strokeWidth={2} />
          </div>
          <div className="relative flex-1">
            <select
              value={filters.sort || '-createdAt'}
              onChange={(e) => onFilterChange({ ...filters, sort: e.target.value, page: 1 })}
              className="w-full appearance-none pl-4 pr-9 py-3 bg-[#F5F5F7] rounded-xl text-[14px] text-[#1D1D1F] outline-none border border-transparent focus:border-apple-blue"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#86868B] pointer-events-none" strokeWidth={2} />
          </div>
        </div>
      )}
    </div>
  );
}
