import { Link } from 'react-router-dom';
import { Star, ShoppingBag } from 'lucide-react';

/**
 * ProductCard — Apple-styled product card
 * 
 * Displays product image, title, category, price, and rating.
 * Hover effect with subtle scale. Links to product detail page.
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
      className="group flex flex-col rounded-[20px] bg-[#F5F5F7] overflow-hidden transition-all duration-300 hover:scale-[1.015]"
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-[#F5F5F7] flex items-center justify-center p-6 sm:p-8 overflow-hidden">
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
          className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.12)] flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 hover:bg-[#F5F5F7] active:scale-90"
        >
          <ShoppingBag className="w-[18px] h-[18px] text-[#1D1D1F]" strokeWidth={1.5} />
        </button>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 p-5 pt-0">
        {/* Category */}
        <span className="text-[11px] uppercase tracking-[0.06em] font-medium text-[#86868B]">
          {category}
        </span>

        {/* Title */}
        <h3 className="text-[15px] sm:text-[17px] font-semibold text-[#1D1D1F] leading-snug line-clamp-2 tracking-[-0.01em]">
          {title}
        </h3>

        {/* Rating */}
        {numReviews > 0 && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-3 h-3 ${
                    star <= Math.round(ratings)
                      ? 'text-[#FF9500] fill-[#FF9500]'
                      : 'text-[#D2D2D7] fill-[#D2D2D7]'
                  }`}
                  strokeWidth={0}
                />
              ))}
            </div>
            <span className="text-[11px] text-[#86868B]">
              ({numReviews})
            </span>
          </div>
        )}

        {/* Price */}
        <p className="text-[17px] sm:text-[19px] font-semibold text-[#1D1D1F] mt-1 tracking-[-0.02em]">
          {formattedPrice}
        </p>
      </div>
    </Link>
  );
}
