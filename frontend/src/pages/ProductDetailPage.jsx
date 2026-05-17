import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Star, ShoppingBag, Truck, Shield, RotateCcw, Package } from 'lucide-react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { useProduct } from '../hooks/useProducts';
import { useCartStore } from '../store/cartStore';

import api from '../lib/axios';

/**
 * ProductDetailPage — Single product view
 * Image gallery, specs, Add to Cart, reviews section (Dark Theme)
 */
export default function ProductDetailPage() {
  const { id } = useParams();
  const { data: product, isLoading, isError } = useProduct(id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const { addItem, open: openCart, items: cartItems } = useCartStore();

  const existingCartItem = cartItems.find((i) => i.productId === id);
  const cartQty = existingCartItem?.quantity || 0;

  // Fetch reviews
  const { data: reviewsData } = useQuery({
    queryKey: ['reviews', id],
    queryFn: async () => {
      const { data } = await api.get(`/reviews/${id}`);
      return data.data;
    },
    enabled: !!id,
  });

  const reviews = reviewsData?.reviews || reviewsData || [];

  const handleAddToCart = () => {
    if (!product) return;
    const result = addItem(product, quantity);
    if (result && !result.success) {
      toast.error(result.message);
      return;
    }
    toast.success('Added to cart!');
    setQuantity(1); // Reset local quantity selection
    openCart();
  };

  const handleBuyNow = () => {
    if (!product) return;
    const result = addItem(product, quantity);
    if (result && !result.success) {
      toast.error(result.message);
      return;
    }
    setQuantity(1);
    navigate('/checkout');
  };

  // Loading
  if (isLoading) {
    return (
      <div className="bg-transparent min-h-screen">
        <div className="apple-section-wide pt-4 pb-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Skeleton */}
            <div className="space-y-4">
              <div className="aspect-square bg-white/[0.03] rounded-[20px] animate-pulse" />
              <div className="flex gap-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-20 h-20 bg-white/[0.03] rounded-xl animate-pulse" />
                ))}
              </div>
            </div>
            {/* Info Skeleton */}
            <div className="space-y-6 pt-2">
              <div className="h-4 w-24 bg-white/[0.03] rounded-full animate-pulse" />
              <div className="h-8 w-3/4 bg-white/[0.03] rounded-full animate-pulse" />
              <div className="h-6 w-32 bg-white/[0.03] rounded-full animate-pulse" />
              <div className="h-20 w-full bg-white/[0.03] rounded-xl animate-pulse" />
              <div className="h-14 w-full bg-white/[0.03] rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error
  if (isError || !product) {
    return (
      <div className="bg-transparent min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/[0.03] flex items-center justify-center">
            <Package className="w-9 h-9 text-white/80" strokeWidth={1.5} />
          </div>
          <h2 className="text-[24px] font-bold text-white mb-2">Product not found</h2>
          <p className="text-[17px] text-white/80 mb-8">The product you're looking for doesn't exist.</p>
          <Link to="/products" className="text-[#9b82ff] hover:opacity-80 transition-opacity text-[17px] inline-flex items-center gap-1">
            Browse all products <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images?.length ? product.images : ['/placeholder-product.png'];
  const formattedPrice = ((val) => `RS ${new Intl.NumberFormat("en-US").format(val)}`)(product.price);
  const availableToAdd = product ? Math.max(0, product.stock - cartQty) : 0;
  const inStock = product.stock > 0;
  const canAddMore = availableToAdd > 0;
  
  // Safe display quantity
  const displayQty = Math.min(Math.max(1, quantity), availableToAdd);

  return (
    <div className="bg-transparent min-h-screen">
      {/* Breadcrumb */}
      <div className="apple-section-wide pt-4 pb-2">
        <nav className="flex items-center gap-1.5 text-[13px] text-white/80">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" strokeWidth={2} />
          <Link to="/products" className="hover:text-white transition-colors">Products</Link>
          {product.category && (
            <>
              <ChevronRight className="w-3 h-3" strokeWidth={2} />
              <Link to={`/products?category=${product.category}`} className="hover:text-white transition-colors capitalize">
                {product.category}
              </Link>
            </>
          )}
          <ChevronRight className="w-3 h-3" strokeWidth={2} />
          <span className="text-white/90 line-clamp-1">{product.title}</span>
        </nav>
      </div>

      {/* Product Content */}
      <section className="apple-section-wide pt-4 pb-12 sm:pb-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 animate-fade-in">

          {/* ─── Image Gallery ─── */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-white/[0.03] border border-white/10 rounded-[24px] flex items-center justify-center p-8 sm:p-12 overflow-hidden shadow-xl relative">
               <div className="absolute inset-0 bg-gradient-to-tr from-[#7a5cff]/5 to-transparent pointer-events-none" />
              <img
                src={images[selectedImage]}
                alt={product.title}
                className="w-full h-full object-contain transition-transform duration-500 hover:scale-105 drop-shadow-2xl z-10"
              />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`
                      w-20 h-20 rounded-xl flex-shrink-0 bg-white/[0.03] flex items-center justify-center p-2 overflow-hidden
                      border transition-all duration-200
                      ${i === selectedImage ? 'border-[#7a5cff] shadow-[0_0_15px_rgba(122,92,255,0.3)]' : 'border-white/10 hover:border-white/30'}
                    `}
                  >
                    <img src={img} alt={`${product.title} ${i + 1}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ─── Product Info ─── */}
          <div className="flex flex-col lg:pt-2">
            {/* Category */}
            <span className="text-[12px] uppercase tracking-[0.08em] font-semibold text-[#9b82ff] mb-3">
              {product.category}
            </span>

            {/* Title */}
            <h1 className="text-[28px] sm:text-[36px] font-bold tracking-[-0.01em] text-white leading-tight mb-4">
              {product.title}
            </h1>

            {/* Rating */}
            {product.numReviews > 0 && (
              <div className="flex items-center gap-2.5 mb-5">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= Math.round(product.ratings)
                          ? 'text-[#FF9500] fill-[#FF9500]'
                          : 'text-white/20 fill-white/20'
                      }`}
                      strokeWidth={0}
                    />
                  ))}
                </div>
                <span className="text-[14px] text-white/60">
                  {product.ratings?.toFixed(1)} ({product.numReviews} {product.numReviews === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            )}

            {/* Price */}
            <p className="text-[32px] sm:text-[40px] font-bold tracking-[-0.02em] text-[#e5deff] mb-6 drop-shadow-md">
              {formattedPrice}
            </p>

            {/* Description */}
            {product.description && (
              <p className="text-[15px] sm:text-[17px] text-white/70 leading-relaxed mb-6 whitespace-pre-line">
                {product.description}
              </p>
            )}

            {/* Stock Status */}
            <div className="flex items-center gap-2 mb-8">
              <div className={`w-2 h-2 rounded-full ${inStock ? 'bg-[#00e676] shadow-[0_0_10px_rgba(0,230,118,0.5)]' : 'bg-[#ff3b57] shadow-[0_0_10px_rgba(255,59,87,0.5)]'}`} />
              <span className={`text-[14px] font-medium ${inStock ? 'text-[#00e676]' : 'text-[#ff3b57]'}`}>
                {inStock ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </span>
            </div>

            {/* Quantity + Add to Cart + Buy Now */}
            {inStock && (
              <div className="flex flex-col gap-4 mb-10">
                {canAddMore ? (
                  <>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                      {/* Quantity Selector */}
                      <div className="flex items-center justify-between sm:justify-center bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden h-[52px]">
                        <button
                          onClick={() => setQuantity(Math.max(1, displayQty - 1))}
                          className="w-12 h-full flex items-center justify-center text-[20px] text-white hover:bg-white/[0.06] transition-colors font-light"
                        >
                          −
                        </button>
                        <span className="w-12 text-center text-[17px] font-medium text-white">{displayQty}</span>
                        <button
                          onClick={() => setQuantity(Math.min(availableToAdd, displayQty + 1))}
                          className="w-12 h-full flex items-center justify-center text-[20px] text-white hover:bg-white/[0.06] transition-colors font-light"
                        >
                          +
                        </button>
                      </div>

                      {/* Add to Cart */}
                      <button
                        onClick={handleAddToCart}
                        className="flex-1 ds-btn-primary h-[52px] rounded-xl font-semibold inline-flex items-center justify-center gap-2"
                      >
                        <ShoppingBag className="w-[18px] h-[18px]" strokeWidth={1.5} />
                        Add to Cart
                      </button>
                    </div>
                    {/* Buy Now */}
                    <button
                      onClick={handleBuyNow}
                      className="w-full h-[52px] rounded-xl font-bold bg-[#00f5d4] text-[#0a0a0a] shadow-[0_0_20px_rgba(0,245,212,0.3)] hover:bg-[#00d4b8] transition-colors flex items-center justify-center gap-2"
                    >
                      Buy Now
                    </button>
                  </>
                ) : (
                  <div className="w-full h-[52px] bg-[#ff9aad]/10 border border-[#ff5e7d]/20 rounded-xl flex items-center justify-center text-[14px] font-semibold text-[#ff5e7d]">
                    Maximum available stock already in cart
                  </div>
                )}
              </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10">
              {[
                { icon: Truck, label: 'Fast Shipping' },
                { icon: Shield, label: 'Secure Checkout' },
                { icon: RotateCcw, label: 'Easy Returns' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="text-center">
                  <Icon className="w-5 h-5 mx-auto mb-2 text-white/50" strokeWidth={1.5} />
                  <span className="text-[12px] text-white/60 font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Reviews Section ─── */}
      <section className="bg-white/[0.02] border-t border-white/5 py-10 sm:py-16">
        <div className="apple-section-wide">
          <h2 className="text-[24px] sm:text-[32px] font-bold tracking-[-0.01em] text-white mb-8">
            Reviews
          </h2>

          {reviews.length === 0 ? (
            <div className="text-center py-12 ds-card max-w-2xl mx-auto">
              <p className="text-[17px] text-white/60">No reviews yet. Be the first to review this product.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review._id} className="ds-card p-6 sm:p-8">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7a5cff] to-[#4532a8] flex items-center justify-center">
                        <span className="text-[15px] font-bold text-white">
                          {review.user?.firstName?.[0] || '?'}
                        </span>
                      </div>
                      <div>
                        <p className="text-[15px] font-semibold text-white">
                          {review.user?.firstName || 'Anonymous'} {review.user?.lastName?.[0] ? review.user.lastName[0] + '.' : ''}
                        </p>
                        <div className="flex items-center gap-0.5 mt-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3 h-3 ${
                                star <= review.rating ? 'text-[#FF9500] fill-[#FF9500]' : 'text-white/20 fill-white/20'
                              }`}
                              strokeWidth={0}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-[13px] text-white/40">
                      {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  {/* Comment */}
                  {review.comment && (
                    <p className="text-[15px] text-white/80 leading-relaxed mt-4">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
