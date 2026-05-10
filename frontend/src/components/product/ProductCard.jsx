import { Link } from 'react-router-dom';
import { Star, ShoppingBag } from 'lucide-react';

/**
 * ProductCard — Apple-styled product card
 * 
 * Displays product image, title, category, price, and rating.
 * Clean #FFFFFF background, rounded-2xl or 3xl, very subtle border.
 */
export default function ProductCard({ product }) {
  const { _id, title, price, images, category, ratings, numReviews } = product;
  const imageUrl = images?.[0] || '/placeholder-product.png';
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);

  return (
    <Link
      to={`/products/${_id}`}
      id={`product-card-${_id}`}
      className="group flex flex-col rounded-[24px] bg-white overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-[#E8E8ED] hover:border-transparent"
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-white flex items-center justify-center p-6 sm:p-8 overflow-hidden border-b border-[#F5F5F7]">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Quick Action */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // TODO: Add to cart
          }}
          className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-[0_2px_12px_rgba(0,0,0,0.08)] flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300 hover:bg-[#F5F5F7] hover:scale-105 active:scale-95"
        >
          <ShoppingBag className="w-5 h-5 text-[#1D1D1F]" strokeWidth={1.5} />
        </button>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-5 sm:p-6 bg-[#FAFAFA]">
        {/* Category & Rating Row */}
        <div className="flex justify-between items-start mb-2">
          <span className="text-[11px] uppercase tracking-[0.05em] font-semibold text-[#86868B]">
            {category}
          </span>
          
          {numReviews > 0 && (
            <div className="flex items-center gap-0.5">
              <Star className="w-3.5 h-3.5 text-[#FF9500] fill-[#FF9500] -mt-0.5" strokeWidth={0} />
              <span className="text-[13px] font-medium text-[#86868B] leading-none">
                {ratings?.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-[16px] sm:text-[18px] font-semibold text-[#1D1D1F] leading-[1.3] line-clamp-2 tracking-[-0.01em] mb-4 min-h-[42px] sm:min-h-[46px]">
          {title}
        </h3>

        {/* Spacer to push price to bottom if titles vary in lines */}
        <div className="mt-auto" />

        {/* Price */}
        <p className="text-[18px] sm:text-[20px] font-semibold text-[#1D1D1F] tracking-[-0.02em]">
          {formattedPrice}
        </p>
      </div>
    </Link>
  );
}
