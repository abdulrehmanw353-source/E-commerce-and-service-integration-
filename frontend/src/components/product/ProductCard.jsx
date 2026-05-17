import { Link } from 'react-router-dom';
import { Star, ShoppingBag } from 'lucide-react';

/**
 * ProductCard — DoorSetFix dark-neon card
 * 
 * Displays product image, title, category, price, and rating.
 */
export default function ProductCard({ product }) {
  const { _id, title, price, images, category, ratings, numReviews } = product;
  const imageUrl = images?.[0] || '/placeholder-product.png';
  const formattedPrice = `RS ${new Intl.NumberFormat('en-US').format(price)}`;

  return (
    <Link
      to={`/products/${_id}`}
      id={`product-card-${_id}`}
      className="group flex flex-col ds-card overflow-hidden transition-all duration-300 hover:shadow-[0_18px_50px_rgba(0,0,0,0.45)] hover:border-[#8f74ff]/40"
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-[#0f1425] flex items-center justify-center p-6 sm:p-8 overflow-hidden border-b border-white/[0.06]">
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
          className="absolute bottom-4 right-4 w-10 h-10 rounded-xl bg-[#141a2c]/80 backdrop-blur-md shadow-[0_10px_28px_rgba(0,0,0,0.35)] border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300 hover:bg-white/[0.06] active:scale-[0.98]"
        >
          <ShoppingBag className="w-5 h-5 text-white" strokeWidth={1.5} />
        </button>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-5 sm:p-6">
        {/* Category & Rating Row */}
        <div className="flex justify-between items-start mb-2">
          <span className="text-[11px] uppercase tracking-[0.08em] font-semibold text-white/45">
            {category}
          </span>
          
          {numReviews > 0 && (
            <div className="flex items-center gap-0.5">
              <Star className="w-3.5 h-3.5 text-[#FF9500] fill-[#FF9500] -mt-0.5" strokeWidth={0} />
              <span className="text-[13px] font-semibold text-white/55 leading-none">
                {ratings?.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Title */}
      <h3 className="text-[15px] sm:text-[17px] font-semibold text-white leading-[1.3] line-clamp-2 tracking-[-0.01em] mb-4 min-h-[42px] sm:min-h-[46px]">
          {title}
        </h3>

        {/* Spacer to push price to bottom if titles vary in lines */}
        <div className="mt-auto" />

        {/* Price */}
      <p className="text-[17px] sm:text-[19px] font-bold text-[#e5deff] tracking-[-0.02em]">
          {formattedPrice}
        </p>
      </div>
    </Link>
  );
}
