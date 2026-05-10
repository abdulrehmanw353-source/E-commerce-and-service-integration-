import { ShoppingBag, Wrench, MessageCircle, ChevronRight, Truck, Shield, Zap, Laptop, Smartphone, Monitor, Tablet, Headphones, Gamepad2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFeaturedProducts } from '../hooks/useProducts';
import ProductGrid from '../components/product/ProductGrid';

const features = [
  {
    icon: ShoppingBag,
    title: 'Shop.',
    subtitle: 'The best way to buy the products you love.',
    description: 'Browse our curated collection of premium tech. Fast shipping, easy returns, and expert advice at every step.',
    linkText: 'Shop now',
    linkTo: '/products',
  },
  {
    icon: Wrench,
    title: 'Repair.',
    subtitle: 'Expert service you can trust.',
    description: 'Book professional repair services for your devices. Certified technicians, genuine parts, same-day availability.',
    linkText: 'Book a repair',
    linkTo: '/services',
  },
  {
    icon: MessageCircle,
    title: 'Support.',
    subtitle: 'We\'re here for you.',
    description: 'Chat with our team in real time. Get instant help with your orders, bookings, or any questions you have.',
    linkText: 'Get support',
    linkTo: '/support',
  },
];

const categories = [
  { name: 'Mac', image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/store-card-13-mac-nav-202310?wid=400&hei=260&fmt=png-alpha&.v=1696964122666', slug: 'laptops' },
  { name: 'iPhone', image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/store-card-13-iphone-nav-202309?wid=400&hei=260&fmt=png-alpha&.v=1692971740000', slug: 'phones' },
  { name: 'iPad', image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/store-card-13-ipad-nav-202210?wid=400&hei=260&fmt=png-alpha&.v=1664912135437', slug: 'tablets' },
  { name: 'Watch', image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/store-card-13-watch-nav-202309?wid=400&hei=260&fmt=png-alpha&.v=1693703822000', slug: 'watches' },
  { name: 'AirPods', image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/store-card-13-airpods-nav-202209?wid=400&hei=260&fmt=png-alpha&.v=1660676485885', slug: 'audio' },
  { name: 'Accessories', image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/store-card-13-accessories-nav-202403?wid=400&hei=260&fmt=png-alpha&.v=1707850611597', slug: 'accessories' },
];

const dummyProducts = [
  { _id: 'd1', title: 'MacBook Pro 14" M3 Max', price: 1999, category: 'Laptops', ratings: 4.9, numReviews: 128, images: ['https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spacegray-select-202310?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1697230830200'] },
  { _id: 'd2', title: 'iPhone 15 Pro Titanium', price: 999, category: 'Phones', ratings: 4.8, numReviews: 256, images: ['https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch-naturaltitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1692875993204'] },
  { _id: 'd3', title: 'AirPods Max - Silver', price: 549, category: 'Audio', ratings: 4.7, numReviews: 89, images: ['https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-max-select-silver-202011?wid=940&hei=800&fmt=jpeg&qlt=90&.v=1604021221000'] },
  { _id: 'd4', title: 'iPad Air 5th Gen', price: 599, category: 'Tablets', ratings: 4.8, numReviews: 154, images: ['https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-air-storage-select-202207-blue?wid=5120&hei=2880&fmt=p-jpg&qlt=95&.v=1670868224523'] },
];

export default function HomePage() {
  const { data: featuredProducts, isLoading: isFeaturedLoading } = useFeaturedProducts(4);

  const displayProducts = featuredProducts?.length > 0 ? featuredProducts : dummyProducts;

  return (
    <div className="bg-white">

      {/* ─── Hero Section (Immersive Apple Style) ──────────────── */}
      <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-24 text-center overflow-hidden min-h-[600px] flex items-center justify-center" id="hero-section">
        {/* Absolute Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero-bg.png" 
            alt="Premium Tech Background" 
            className="w-full h-full object-cover opacity-40"
          />
          {/* Subtle fade to white at the bottom so it blends into the next section */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-white/70 to-white" />
        </div>

        <div className="apple-section relative z-10 animate-fade-in w-full">
          <h1 className="text-[48px] sm:text-[64px] md:text-[80px] font-bold tracking-[-0.04em] leading-[1.05] text-[#1D1D1F] mb-6">
            Your one-stop <br className="hidden sm:block" />
            tech destination.
          </h1>

          <p className="text-[20px] sm:text-[24px] font-medium leading-[1.4] text-[#86868B] max-w-[640px] mx-auto mb-10 px-4">
            Shop premium products. Book expert repairs. <br className="hidden sm:block" />
            Get instant support. All in one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Link
              to="/products"
              id="hero-shop-btn"
              className="apple-btn apple-btn-primary text-[17px] px-8 py-4 shadow-[0_4px_14px_rgba(0,113,227,0.3)] hover:shadow-[0_6px_20px_rgba(0,113,227,0.4)]"
            >
              Start Shopping
              <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
            </Link>
            <Link
              to="/services"
              id="hero-learn-btn"
              className="apple-btn bg-white/80 backdrop-blur-md border border-[#E8E8ED] text-[#1D1D1F] hover:bg-white text-[17px] px-8 py-4 shadow-[0_4px_14px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.08)]"
            >
              Book a repair
              <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Features Grid ──────────────────────────────── */}
      <section className="py-16 sm:py-24" id="features-section">
        <div className="apple-section-wide">
          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, i) => (
              <Link
                to={feature.linkTo}
                key={feature.title}
                id={`feature-card-${i}`}
                className="group rounded-[32px] bg-[#F5F5F7] p-8 sm:p-10 transition-all duration-300 hover:scale-[1.02] hover:bg-white hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] border border-transparent hover:border-[#E8E8ED] animate-slide-up cursor-pointer flex flex-col h-full"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center mb-6 shadow-[0_2px_8px_rgba(0,0,0,0.06)] group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-[24px] h-[24px] text-[#1D1D1F]" strokeWidth={1.5} />
                </div>
                <h2 className="text-[32px] sm:text-[36px] font-bold tracking-[-0.03em] leading-[1.1] text-[#1D1D1F] mb-2">
                  {feature.title}
                </h2>
                <p className="text-[19px] font-medium text-[#1D1D1F] leading-[1.38] mb-3">
                  {feature.subtitle}
                </p>
                <p className="text-[17px] font-normal text-[#86868B] leading-[1.5] mb-6 flex-1">
                  {feature.description}
                </p>
                <div className="mt-auto">
                  <span className="text-apple-blue text-[17px] font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all duration-200 bg-apple-blue/5 px-4 py-2 rounded-full">
                    {feature.linkText}
                    <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Products ──────────────────────────── */}
      <section className="py-16 sm:py-24 bg-[#FAFAFA]" id="featured-products-section">
        <div className="apple-section-wide">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-14 gap-4">
            <div>
              <h2 className="text-[36px] sm:text-[44px] font-bold tracking-[-0.03em] text-[#1D1D1F] leading-tight">
                Featured Products.
              </h2>
              <p className="text-[19px] sm:text-[21px] font-medium text-[#86868B] mt-2">
                Our top-rated products, loved by customers.
              </p>
            </div>
            <Link
              to="/products"
              className="hidden sm:inline-flex items-center gap-1.5 text-[#1D1D1F] bg-white border border-[#E8E8ED] px-5 py-2.5 rounded-full text-[15px] font-medium hover:bg-[#F5F5F7] transition-all duration-200"
            >
              Shop all products
              <ChevronRight className="w-4 h-4" strokeWidth={2} />
            </Link>
          </div>

          <ProductGrid products={displayProducts} loading={isFeaturedLoading} />

          {/* Mobile View All Link */}
          <div className="sm:hidden text-center mt-8">
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 text-[#1D1D1F] bg-white border border-[#E8E8ED] px-6 py-3 rounded-full text-[15px] font-medium shadow-sm hover:bg-[#F5F5F7] transition-all duration-200"
            >
              Shop all products
              <ChevronRight className="w-4 h-4" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Categories ─────────────────────────────────── */}
      <section className="py-16 sm:py-24" id="categories-section">
        <div className="apple-section-wide">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-[36px] sm:text-[44px] font-bold tracking-[-0.03em] text-[#1D1D1F] leading-tight">
              Shop by Category.
            </h2>
            <p className="text-[19px] sm:text-[21px] font-medium text-[#86868B] mt-2">
              Find exactly what you need.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/products?category=${cat.slug}`}
                className="group flex flex-col items-center justify-start gap-4 transition-all duration-300 cursor-pointer"
              >
                <div className="relative w-full max-w-[160px] aspect-[4/3] rounded-[24px] bg-white group-hover:bg-[#F5F5F7] transition-colors duration-300 flex items-center justify-center p-4">
                  <img 
                    src={cat.image} 
                    alt={cat.name} 
                    className="w-auto h-full max-h-[80px] object-contain group-hover:scale-110 transition-transform duration-500 ease-out drop-shadow-sm"
                  />
                </div>
                <span className="text-[15px] sm:text-[17px] font-medium text-[#1D1D1F] tracking-[-0.01em] group-hover:text-apple-blue transition-colors">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Repair Service Promo (Immersive) ────────────── */}
      <section className="py-16 sm:py-24" id="repair-promo-section">
        <div className="apple-section-wide">
          <div className="rounded-[40px] bg-[#000000] min-h-[480px] sm:min-h-[560px] text-center overflow-hidden relative shadow-[0_24px_50px_rgba(0,0,0,0.2)] flex flex-col items-center justify-center px-6 sm:px-16 py-20">
            {/* Dark Tech Background Image */}
            <div className="absolute inset-0 z-0">
              <img 
                src="/repair-bg.png" 
                alt="Tech Repair Background" 
                className="w-full h-full object-cover opacity-60 mix-blend-screen"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80" />
            </div>
            
            <div className="relative z-10 flex flex-col items-center w-full max-w-[700px]">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mb-8 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/20">
                <Wrench className="w-8 h-8 sm:w-10 sm:h-10 text-white" strokeWidth={1.5} />
              </div>
              <h2 className="text-[40px] sm:text-[56px] md:text-[64px] font-bold tracking-[-0.03em] leading-[1.05] text-white mb-6">
                Expert Repair Services.
              </h2>
              <p className="text-[19px] sm:text-[24px] text-white/70 font-medium text-center mb-10 leading-[1.4] max-w-[600px]">
                From cracked screens to battery replacements. Certified technicians, genuine parts, and same-day service.
              </p>
              <Link
                to="/services"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#1D1D1F] px-10 py-4 rounded-full text-[19px] font-semibold hover:bg-[#F5F5F7] hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_4px_20px_rgba(255,255,255,0.2)]"
              >
                Book a Repair
                <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Trust Strip ─────────────────────────────────── */}
      <section className="py-12 sm:py-16" id="trust-section">
        <div className="apple-section-wide">
          <div className="grid sm:grid-cols-3 gap-12 sm:gap-16">
            {[
              { icon: Truck, title: 'Free Delivery', desc: 'Enjoy free delivery on all orders over $50.' },
              { icon: Shield, title: 'Secure Payments', desc: 'Your payments are protected by end-to-end encryption.' },
              { icon: Zap, title: 'Same-Day Repair', desc: 'Walk in or book online for fast, reliable service.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#F5F5F7] flex items-center justify-center mb-6">
                  <Icon className="w-[28px] h-[28px] text-[#1D1D1F]" strokeWidth={1.5} />
                </div>
                <h3 className="text-[21px] font-bold tracking-[-0.01em] text-[#1D1D1F] leading-tight mb-3">
                  {title}
                </h3>
                <p className="text-[17px] font-medium text-[#86868B] leading-[1.5] max-w-[280px]">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
