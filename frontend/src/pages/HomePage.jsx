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
  { name: 'Laptops', icon: Laptop, slug: 'laptops' },
  { name: 'Phones', icon: Smartphone, slug: 'phones' },
  { name: 'Desktops', icon: Monitor, slug: 'desktops' },
  { name: 'Tablets', icon: Tablet, slug: 'tablets' },
  { name: 'Audio', icon: Headphones, slug: 'audio' },
  { name: 'Gaming', icon: Gamepad2, slug: 'gaming' },
];

export default function HomePage() {
  const { data: featuredProducts, isLoading: isFeaturedLoading } = useFeaturedProducts(4);

  return (
    <div className="bg-white">

      {/* ─── Hero ───────────────────────────────────────── */}
      <section className="pt-16 sm:pt-24 pb-14 sm:pb-20 text-center" id="hero-section">
        <div className="apple-section animate-fade-in">
          <h1 className="text-[40px] sm:text-[56px] md:text-[64px] font-bold tracking-[-0.03em] leading-[1.05] text-[#1D1D1F] mb-4 sm:mb-5">
            Your one-stop{' '}
            <br />
            tech destination.
          </h1>

          <p className="text-[17px] sm:text-[21px] font-normal leading-[1.47] text-[#86868B] max-w-[560px] mx-auto mb-8 sm:mb-10 px-2">
            Shop premium products. Book expert repairs.{' '}
            Get instant support. All in one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
            <Link
              to="/products"
              id="hero-shop-btn"
              className="apple-btn apple-btn-primary text-[17px] px-8 py-3.5"
            >
              Start Shopping
              <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
            </Link>
            <Link
              to="/services"
              id="hero-learn-btn"
              className="apple-link text-[17px] inline-flex items-center gap-1"
            >
              Book a repair
              <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Features Grid ──────────────────────────────── */}
      <section className="pb-6 sm:pb-8" id="features-section">
        <div className="apple-section-wide">
          <div className="grid md:grid-cols-3 gap-5 sm:gap-6">
            {features.map((feature, i) => (
              <Link
                to={feature.linkTo}
                key={feature.title}
                id={`feature-card-${i}`}
                className="group rounded-[20px] bg-[#F5F5F7] p-7 sm:p-9 transition-all duration-300 hover:scale-[1.012] animate-slide-up cursor-pointer"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center mb-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
                  <feature.icon className="w-[20px] h-[20px] text-[#1D1D1F]" strokeWidth={1.5} />
                </div>
                <h2 className="text-[28px] sm:text-[32px] font-bold tracking-[-0.03em] leading-[1.1] text-[#1D1D1F] mb-1.5">
                  {feature.title}
                </h2>
                <p className="text-[17px] font-normal text-[#1D1D1F] leading-[1.38] mb-2.5">
                  {feature.subtitle}
                </p>
                <p className="text-[15px] font-normal text-[#86868B] leading-[1.53] mb-5">
                  {feature.description}
                </p>
                <span className="text-apple-blue text-[15px] font-normal inline-flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
                  {feature.linkText}
                  <ChevronRight className="w-3.5 h-3.5" strokeWidth={2.5} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Products ──────────────────────────── */}
      <section className="py-16 sm:py-20" id="featured-products-section">
        <div className="apple-section-wide">
          <div className="flex items-end justify-between mb-8 sm:mb-10">
            <div>
              <h2 className="text-[28px] sm:text-[36px] font-bold tracking-[-0.03em] text-[#1D1D1F] leading-tight">
                Featured Products
              </h2>
              <p className="text-[15px] sm:text-[17px] text-[#86868B] mt-2">
                Our top-rated products, loved by customers.
              </p>
            </div>
            <Link
              to="/products"
              className="hidden sm:inline-flex items-center gap-1 text-apple-blue text-[15px] font-normal hover:gap-2 transition-all duration-200"
            >
              View all
              <ChevronRight className="w-3.5 h-3.5" strokeWidth={2.5} />
            </Link>
          </div>

          <ProductGrid products={featuredProducts || []} loading={isFeaturedLoading} />

          {/* Mobile View All Link */}
          <div className="sm:hidden text-center mt-6">
            <Link
              to="/products"
              className="inline-flex items-center gap-1 text-apple-blue text-[15px] font-normal"
            >
              View all products
              <ChevronRight className="w-3.5 h-3.5" strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Categories ─────────────────────────────────── */}
      <section className="py-10 sm:py-16 bg-[#F5F5F7]" id="categories-section">
        <div className="apple-section-wide">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-[28px] sm:text-[36px] font-bold tracking-[-0.03em] text-[#1D1D1F] leading-tight">
              Shop by Category
            </h2>
            <p className="text-[15px] sm:text-[17px] text-[#86868B] mt-2">
              Find exactly what you need.
            </p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 sm:gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/products?category=${cat.slug}`}
                className="group flex flex-col items-center gap-3 py-6 sm:py-8 rounded-2xl bg-white transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#F5F5F7] group-hover:bg-[#E8E8ED] flex items-center justify-center transition-colors duration-200">
                  <cat.icon className="w-6 h-6 sm:w-7 sm:h-7 text-[#1D1D1F]" strokeWidth={1.3} />
                </div>
                <span className="text-[13px] sm:text-[14px] font-medium text-[#1D1D1F] tracking-[-0.01em]">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Repair Service Promo ───────────────────────── */}
      <section className="py-8 sm:py-12" id="repair-promo-section">
        <div className="apple-section-wide">
          <div className="rounded-[24px] bg-[#1D1D1F] px-8 py-14 sm:px-16 sm:py-20 text-center overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-apple-blue/8 via-transparent to-apple-purple/8 pointer-events-none" />
            
            <div className="relative z-10">
              <div className="w-14 h-14 mx-auto mb-7 rounded-full bg-white/10 flex items-center justify-center">
                <Wrench className="w-7 h-7 text-white" strokeWidth={1.5} />
              </div>
              <h2 className="text-[32px] sm:text-[44px] md:text-[48px] font-bold tracking-[-0.03em] leading-[1.08] text-white mb-5">
                Expert Repair Services
              </h2>
              <p className="text-[17px] sm:text-[19px] text-white/60 font-normal max-w-[500px] mx-auto mb-10 leading-relaxed">
                From cracked screens to battery replacements. Certified technicians, genuine parts, and same-day service available.
              </p>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 bg-white text-[#1D1D1F] px-8 py-3.5 rounded-full text-[17px] font-medium hover:bg-white/90 active:scale-[0.97] transition-all duration-150"
              >
                Book a Repair
                <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Trust Strip ─────────────────────────────────── */}
      <section className="py-14 sm:py-20 border-t border-[#E8E8ED]" id="trust-section">
        <div className="apple-section">
          <div className="grid sm:grid-cols-3 gap-10 sm:gap-16">
            {[
              { icon: Truck, title: 'Free Delivery', desc: 'On orders over $50.' },
              { icon: Shield, title: 'Secure Payments', desc: 'End-to-end encryption.' },
              { icon: Zap, title: 'Same-Day Repair', desc: 'Walk in or book online.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-[#F5F5F7] flex items-center justify-center flex-shrink-0">
                  <Icon className="w-[20px] h-[20px] text-[#1D1D1F]" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold text-[#1D1D1F] leading-tight mb-1.5">
                    {title}
                  </h3>
                  <p className="text-[14px] text-[#86868B] leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
