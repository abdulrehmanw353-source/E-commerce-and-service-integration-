import { ShoppingBag, Wrench, MessageCircle, ChevronRight, Truck, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

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

export default function HomePage() {
  return (
    <div className="bg-white">

      {/* ─── Hero ───────────────────────────────────────── */}
      <section className="pt-20 pb-12 sm:pt-28 sm:pb-20 text-center" id="hero-section">
        <div className="apple-section animate-fade-in">
          {/* Headline */}
          <h1 className="text-[44px] sm:text-[56px] md:text-[64px] font-bold tracking-[-0.03em] leading-[1.05] text-[#1D1D1F] mb-5">
            Your one-stop{' '}
            <br />
            tech destination.
          </h1>

          {/* Subtitle */}
          <p className="text-[19px] sm:text-[21px] font-normal leading-[1.42] text-[#86868B] max-w-[580px] mx-auto mb-10">
            Shop premium products. Book expert repairs.{' '}
            Get instant support. All in one place.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/products"
              id="hero-shop-btn"
              className="apple-btn apple-btn-primary text-[17px] px-8 py-3"
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
      <section className="py-3 sm:py-4" id="features-section">
        <div className="apple-section-wide">
          <div className="grid md:grid-cols-3 gap-5">
            {features.map((feature, i) => (
              <Link
                to={feature.linkTo}
                key={feature.title}
                id={`feature-card-${i}`}
                className="group rounded-[20px] bg-[#F5F5F7] p-8 sm:p-10 transition-all duration-300 hover:scale-[1.015] animate-slide-up cursor-pointer"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
                  <feature.icon className="w-[22px] h-[22px] text-[#1D1D1F]" strokeWidth={1.5} />
                </div>

                {/* Title */}
                <h2 className="text-[28px] sm:text-[32px] font-bold tracking-[-0.03em] leading-[1.1] text-[#1D1D1F] mb-1">
                  {feature.title}
                </h2>

                {/* Subtitle */}
                <p className="text-[17px] font-normal text-[#1D1D1F] leading-[1.38] mb-3">
                  {feature.subtitle}
                </p>

                {/* Description */}
                <p className="text-[15px] font-normal text-[#86868B] leading-[1.53] mb-5">
                  {feature.description}
                </p>

                {/* Link */}
                <span className="text-apple-blue text-[15px] font-normal inline-flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
                  {feature.linkText}
                  <ChevronRight className="w-3.5 h-3.5" strokeWidth={2.5} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Repair Service Promo ───────────────────────── */}
      <section className="py-16 sm:py-20 mt-4" id="repair-promo-section">
        <div className="apple-section-wide">
          <div className="rounded-[24px] bg-[#1D1D1F] p-10 sm:p-16 text-center overflow-hidden relative">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-apple-blue/10 via-transparent to-apple-purple/10 pointer-events-none" />
            
            <div className="relative z-10">
              <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-white/10 flex items-center justify-center">
                <Wrench className="w-7 h-7 text-white" strokeWidth={1.5} />
              </div>
              <h2 className="text-[36px] sm:text-[48px] font-bold tracking-[-0.03em] leading-[1.08] text-white mb-4">
                Expert Repair Services
              </h2>
              <p className="text-[17px] sm:text-[19px] text-white/60 font-normal max-w-[520px] mx-auto mb-8 leading-relaxed">
                From cracked screens to battery replacements. Certified technicians, genuine parts, and same-day service available.
              </p>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 bg-white text-[#1D1D1F] px-8 py-3.5 rounded-full text-[17px] font-medium hover:bg-white/90 active:scale-[0.96] transition-all duration-150"
              >
                Book a Repair
                <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Trust Strip ─────────────────────────────────── */}
      <section className="py-14 sm:py-20" id="trust-section">
        <div className="apple-section">
          <div className="grid sm:grid-cols-3 gap-10 sm:gap-12">
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
                  <h3 className="text-[15px] font-semibold text-[#1D1D1F] leading-tight mb-1">
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
