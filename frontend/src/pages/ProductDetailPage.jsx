import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Star, ShoppingBag, Truck, Shield, RotateCcw, Package } from 'lucide-react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { useProduct } from '../hooks/useProducts';
import Button from '../components/ui/Button';
import api from '../lib/axios';

/**
 * ProductDetailPage — Single product view
 * Image gallery, specs, Add to Cart, reviews section
 */
export default function ProductDetailPage() {
  const { id } = useParams();
  const { data: product, isLoading, isError } = useProduct(id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

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

  const handleAddToCart = async () => {
    setAddingToCart(true);
    try {
      await api.post('/cart', { productId: id, quantity });
      toast.success('Added to cart!');
    } catch (err) {
      const msg = err.response?.data?.message || 'Please sign in to add items to cart.';
      toast.error(msg);
    } finally {
      setAddingToCart(false);
    }
  };

  // Loading
  if (isLoading) {
    return (
      <div className="bg-white min-h-screen">
        <div className="apple-section-wide pt-4 pb-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Skeleton */}
            <div className="space-y-4">
              <div className="aspect-square bg-[#F5F5F7] rounded-[20px] animate-pulse" />
              <div className="flex gap-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-20 h-20 bg-[#F5F5F7] rounded-xl animate-pulse" />
                ))}
              </div>
            </div>
            {/* Info Skeleton */}
            <div className="space-y-6 pt-2">
              <div className="h-4 w-24 bg-[#F5F5F7] rounded-full animate-pulse" />
              <div className="h-8 w-3/4 bg-[#F5F5F7] rounded-full animate-pulse" />
              <div className="h-6 w-32 bg-[#F5F5F7] rounded-full animate-pulse" />
              <div className="h-20 w-full bg-[#F5F5F7] rounded-xl animate-pulse" />
              <div className="h-14 w-full bg-[#F5F5F7] rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error
  if (isError || !product) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#F5F5F7] flex items-center justify-center">
            <Package className="w-9 h-9 text-[#86868B]" strokeWidth={1.5} />
          </div>
          <h2 className="text-[24px] font-bold text-[#1D1D1F] mb-2">Product not found</h2>
          <p className="text-[17px] text-[#86868B] mb-8">The product you're looking for doesn't exist.</p>
          <Link to="/products" className="apple-link text-[17px] inline-flex items-center gap-1">
            Browse all products <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images?.length ? product.images : ['/placeholder-product.png'];
  const formattedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price);
  const inStock = product.stock > 0;

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="apple-section-wide pt-4 pb-2">
        <nav className="flex items-center gap-1.5 text-[13px] text-[#86868B]">
          <Link to="/" className="hover:text-apple-blue transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" strokeWidth={2} />
          <Link to="/products" className="hover:text-apple-blue transition-colors">Products</Link>
          {product.category && (
            <>
              <ChevronRight className="w-3 h-3" strokeWidth={2} />
              <Link to={`/products?category=${product.category}`} className="hover:text-apple-blue transition-colors capitalize">
                {product.category}
              </Link>
            </>
          )}
          <ChevronRight className="w-3 h-3" strokeWidth={2} />
          <span className="text-[#1D1D1F] line-clamp-1">{product.title}</span>
        </nav>
      </div>

      {/* Product Content */}
      <section className="apple-section-wide pt-4 pb-12 sm:pb-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 animate-fade-in">

          {/* ─── Image Gallery ─── */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-[#F5F5F7] rounded-[24px] flex items-center justify-center p-8 sm:p-12 overflow-hidden">
              <img
                src={images[selectedImage]}
                alt={product.title}
                className="w-full h-full object-contain transition-transform duration-500 hover:scale-105"
              />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`
                      w-20 h-20 rounded-xl flex-shrink-0 bg-[#F5F5F7] flex items-center justify-center p-2 overflow-hidden
                      border-2 transition-all duration-200
                      ${i === selectedImage ? 'border-apple-blue' : 'border-transparent hover:border-[#D2D2D7]'}
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
            <span className="text-[12px] uppercase tracking-[0.06em] font-semibold text-apple-blue mb-3">
              {product.category}
            </span>

            {/* Title */}
            <h1 className="text-[28px] sm:text-[36px] font-bold tracking-[-0.03em] text-[#1D1D1F] leading-tight mb-4">
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
                          : 'text-[#D2D2D7] fill-[#D2D2D7]'
                      }`}
                      strokeWidth={0}
                    />
                  ))}
                </div>
                <span className="text-[14px] text-[#86868B]">
                  {product.ratings?.toFixed(1)} ({product.numReviews} {product.numReviews === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            )}

            {/* Price */}
            <p className="text-[32px] sm:text-[40px] font-bold tracking-[-0.03em] text-[#1D1D1F] mb-6">
              {formattedPrice}
            </p>

            {/* Description */}
            {product.description && (
              <p className="text-[15px] sm:text-[17px] text-[#86868B] leading-relaxed mb-6 whitespace-pre-line">
                {product.description}
              </p>
            )}

            {/* Stock Status */}
            <div className="flex items-center gap-2 mb-8">
              <div className={`w-2 h-2 rounded-full ${inStock ? 'bg-apple-green' : 'bg-apple-red'}`} />
              <span className={`text-[14px] font-medium ${inStock ? 'text-apple-green' : 'text-apple-red'}`}>
                {inStock ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </span>
            </div>

            {/* Quantity + Add to Cart */}
            {inStock && (
              <div className="flex items-center gap-4 mb-10">
                {/* Quantity Selector */}
                <div className="flex items-center bg-[#F5F5F7] rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-11 h-11 flex items-center justify-center text-[20px] text-[#1D1D1F] hover:bg-[#E8E8ED] transition-colors font-light"
                  >
                    −
                  </button>
                  <span className="w-12 text-center text-[17px] font-medium text-[#1D1D1F]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-11 h-11 flex items-center justify-center text-[20px] text-[#1D1D1F] hover:bg-[#E8E8ED] transition-colors font-light"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleAddToCart}
                  loading={addingToCart}
                  className="flex-1"
                >
                  <ShoppingBag className="w-[18px] h-[18px]" strokeWidth={1.5} />
                  Add to Cart
                </Button>
              </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-[#E8E8ED]">
              {[
                { icon: Truck, label: 'Free Shipping' },
                { icon: Shield, label: 'Secure Checkout' },
                { icon: RotateCcw, label: 'Easy Returns' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="text-center">
                  <Icon className="w-5 h-5 mx-auto mb-2 text-[#86868B]" strokeWidth={1.5} />
                  <span className="text-[12px] text-[#86868B] font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Reviews Section ─── */}
      <section className="bg-[#F5F5F7] py-10 sm:py-16">
        <div className="apple-section-wide">
          <h2 className="text-[24px] sm:text-[32px] font-bold tracking-[-0.03em] text-[#1D1D1F] mb-8">
            Reviews
          </h2>

          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[17px] text-[#86868B]">No reviews yet. Be the first to review this product.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review._id} className="bg-white rounded-[24px] p-6 sm:p-8 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-[#E8E8ED]">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#F5F5F7] flex items-center justify-center">
                        <span className="text-[15px] font-semibold text-[#1D1D1F]">
                          {review.user?.firstName?.[0] || '?'}
                        </span>
                      </div>
                      <div>
                        <p className="text-[15px] font-semibold text-[#1D1D1F]">
                          {review.user?.firstName || 'Anonymous'} {review.user?.lastName?.[0] ? review.user.lastName[0] + '.' : ''}
                        </p>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3 h-3 ${
                                star <= review.rating ? 'text-[#FF9500] fill-[#FF9500]' : 'text-[#D2D2D7] fill-[#D2D2D7]'
                              }`}
                              strokeWidth={0}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-[13px] text-[#86868B]">
                      {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  {/* Comment */}
                  {review.comment && (
                    <p className="text-[15px] text-[#1D1D1F] leading-relaxed mt-3">{review.comment}</p>
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
