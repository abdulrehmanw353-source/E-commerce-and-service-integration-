import { ChevronRight, ShoppingBag, Wrench, Star, Smartphone, Laptop, Monitor, Tablet, Headphones, Gamepad2, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFeaturedProducts } from '../hooks/useProducts';
import ProductCard from '../components/product/ProductCard';

export default function HomePage() {
  const serviceIcons = [
    { label: 'Phone Repair', icon: Smartphone },
    { label: 'Laptop Repair', icon: Laptop },
    { label: 'PC Build & Fix', icon: Monitor },
    { label: 'Tablet Repair', icon: Tablet },
  ];

  const categories = [
    { label: 'Smartphones', icon: Smartphone },
    { label: 'Laptops', icon: Laptop },
    { label: 'Desktops', icon: Monitor },
    { label: 'Tablets', icon: Tablet },
    { label: 'Audio', icon: Headphones },
    { label: 'Gaming', icon: Gamepad2 },
  ];

  const testimonials = [
    { name: 'Sarah Jenkins', role: 'Tech Enthusiast', text: 'Got my MacBook screen replaced in under 2 hours. The technician was professional and the pricing was transparent. Highly recommend!', rating: 5 },
    { name: 'Michael Chen', role: 'Business Owner', text: 'We buy all our office tech accessories from them now. Quality products and the repair service for our company laptops is seamless.', rating: 5 },
    { name: 'Emily Rodriguez', role: 'Freelancer', text: 'My phone screen cracked and they fixed it same-day. Great prices on accessories too — bought a case and charger while I waited.', rating: 5 },
  ];

  const { data: featuredProducts, isLoading } = useFeaturedProducts(4);

  return (
    <div className="py-10 sm:py-14 space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <div className="apple-section-wide">
        <section className="ds-shell p-4 sm:p-6">
          <div className="rounded-[20px] overflow-hidden relative border border-white/15 min-h-[470px]">
            <img
              src="/hero-bg.png"
              alt="Service technician"
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1581141849291-1125c7b692b5?auto=format&fit=crop&q=80'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0d18]/35 via-[#0a0d18]/45 to-[#0a0d18]/78" />
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-4 sm:px-10">
              <div className="mx-auto max-w-[780px] rounded-[26px] border border-white/20 bg-[#12182a]/62 backdrop-blur-[12px] p-6 sm:p-9 text-center">
                <h1 className="text-white text-[40px] sm:text-[58px] font-extrabold tracking-[-0.03em] leading-[1.02]">
                  Tech Repair & Accessories
                </h1>
                <p className="text-white/75 mt-3 text-[16px] sm:text-[20px]">
                  Expert electronics repair services and premium tech accessories — all in one place.
                </p>
                <div className="mt-7 flex flex-col sm:flex-row justify-center gap-3">
                  <Link to="/services" className="px-7 py-3 rounded-full font-semibold ds-btn-primary inline-flex items-center justify-center gap-2">
                    Book a Repair <ChevronRight className="w-4 h-4" />
                  </Link>
                  <Link to="/products" className="px-7 py-3 rounded-full font-semibold bg-white border border-white/20 inline-flex items-center justify-center gap-2 transition-all hover:bg-gray-100" style={{ color: '#000' }}>
                    Shop Accessories <ShoppingBag className="w-4 h-4" style={{ color: '#000' }} />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {serviceIcons.map(({ label, icon: Icon }) => (
              <div key={label} className="ds-card p-5 sm:p-6 text-center">
                <div className="w-12 h-12 mx-auto rounded-2xl border border-white/10 bg-[#1a223a] flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-[#9b82ff]" />
                </div>
                <p className="text-white font-semibold text-[20px]">{label}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Featured Products Slider */}
      <section className="apple-section-wide">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[28px] sm:text-[36px] font-bold text-white tracking-tight">Featured Products</h2>
          <Link to="/products" className="text-[#9b82ff] font-medium inline-flex items-center hover:opacity-80 transition-opacity">
            View All <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-[360px] skeleton rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="flex overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 gap-6 snap-x snap-mandatory scrollbar-hide">
            {featuredProducts?.map((product) => (
              <div key={product._id} className="min-w-[280px] w-[85vw] sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] flex-shrink-0 snap-start">
                <ProductCard product={product} />
              </div>
            ))}
            {(!featuredProducts || featuredProducts.length === 0) && (
              <p className="text-white/50 py-10 w-full text-center">No featured products found.</p>
            )}
          </div>
        )}
      </section>

      {/* Categories Section */}
      <section className="apple-section-wide">
        <h2 className="text-[28px] sm:text-[36px] font-bold text-white tracking-tight mb-8 text-center">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map(({ label, icon: Icon }) => (
            <Link key={label} to={`/products?category=${label.toLowerCase()}`} className="ds-card p-6 flex flex-col items-center justify-center group hover:-translate-y-1 transition-transform">
              <div className="w-14 h-14 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center mb-4 group-hover:bg-[#7a5cff]/20 group-hover:border-[#7a5cff]/40 transition-colors">
                <Icon className="w-7 h-7 text-[#cbc6ed] group-hover:text-white transition-colors" strokeWidth={1.5} />
              </div>
              <span className="text-white/90 font-medium text-[15px]">{label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="apple-section-wide">
        <div className="ds-shell p-8 sm:p-12 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-[#7a5cff] rounded-full blur-[100px] opacity-20" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-[#0071E3] rounded-full blur-[100px] opacity-20" />
          
          <div className="relative z-10 max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[13px] font-medium text-[#9b82ff] mb-4">
              <Cpu className="w-4 h-4" /> Electronics Repair
            </div>
            <h2 className="text-[32px] sm:text-[42px] font-bold text-white leading-tight mb-4 tracking-tight">
              Broken Screen? Dead Battery? We Fix It All.
            </h2>
            <p className="text-white/70 text-[17px] sm:text-[19px] mb-8 leading-relaxed">
              Book expert technicians for phones, laptops, PCs, and tablets. Certified repairs with genuine parts, transparent pricing, and fast turnaround.
            </p>
            <Link to="/services" className="ds-btn-primary px-8 py-3.5 rounded-full font-semibold inline-flex items-center justify-center text-[17px]">
              Book a Repair Now
            </Link>
          </div>
          <div className="relative z-10 lg:w-1/2 flex justify-center lg:justify-end">
             {/* A nice illustration placeholder or icons */}
             <div className="relative w-full max-w-[400px] aspect-square rounded-[32px] border border-white/10 bg-gradient-to-tr from-white/5 to-white/[0.01] flex items-center justify-center p-8 overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-40 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f1d] via-transparent to-transparent" />
                <div className="relative flex flex-col items-center">
                  <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 mb-6 shadow-[0_0_30px_rgba(122,92,255,0.3)]">
                    <Wrench className="w-10 h-10 text-white" />
                  </div>
                  <div className="flex gap-2">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 text-[#FF9500] fill-[#FF9500]" />)}
                  </div>
                  <p className="text-white font-bold mt-2 text-lg">Top Rated Experts</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Testimonials - CRO Optimized */}
      <section className="apple-section-wide pb-8">
        <div className="text-center mb-10">
          <h2 className="text-[28px] sm:text-[36px] font-bold text-white tracking-tight mb-3">Trusted by Thousands</h2>
          <p className="text-white/60 text-[17px]">See what our customers have to say about our service and products.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div key={idx} className="ds-card p-8 flex flex-col">
              <div className="flex gap-1 mb-5">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-[#FF9500] fill-[#FF9500]" />
                ))}
              </div>
              <p className="text-white/80 text-[16px] leading-relaxed mb-6 flex-1 italic">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7a5cff] to-[#4532a8] flex items-center justify-center font-bold text-white text-[14px]">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-medium text-[15px]">{t.name}</p>
                  <p className="text-white/50 text-[13px]">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      
    </div>
  );
}
