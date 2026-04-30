import { ShoppingBag, Wrench, MessageCircle, ChevronRight, Truck, Shield, Zap } from 'lucide-react';


const features = [
  {
    icon: ShoppingBag,
    title: 'Shop.',
    subtitle: 'The best way to buy the products you love.',
    description: 'Browse our curated collection of premium tech. Fast shipping, easy returns, and expert advice at every step.',
    linkText: 'Shop now',
    bg: 'bg-bg-secondary',
  },
  {
    icon: Wrench,
    title: 'Repair.',
    subtitle: 'Expert service you can trust.',
    description: 'Book professional repair services for your devices. Certified technicians, genuine parts, same-day availability.',
    linkText: 'Book a repair',
    bg: 'bg-bg-secondary',
  },
  {
    icon: MessageCircle,
    title: 'Support.',
    subtitle: 'We\'re here for you.',
    description: 'Chat with our team in real time. Get instant help with your orders, bookings, or any questions you have.',
    linkText: 'Get support',
    bg: 'bg-bg-secondary',
  },
];

export default function HomePage() {
  return (
    <div className="bg-bg-primary">

      {/* ─── Hero ───────────────────────────────────────── */}
      <section className="pt-16 pb-10 sm:pt-24 sm:pb-16 text-center" id="hero-section">
        <div className="apple-section animate-fade-in">
          {/* Headline */}
          <h1 className="text-[40px] sm:text-[56px] md:text-[64px] font-semibold tracking-tight leading-[1.05] text-label-primary mb-4">
            Your one-stop
            <br />
            tech destination.
          </h1>

          {/* Subtitle */}
          <p className="text-[19px] sm:text-[21px] font-normal leading-[1.38] text-label-secondary max-w-[600px] mx-auto mb-8">
            Shop premium products. Book expert repairs.
            <br className="hidden sm:block" />
            Get instant support. All in one place.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="hero-shop-btn"
              className="apple-btn apple-btn-primary text-[17px] px-8 py-3"
            >
              Start Shopping
              <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
            </button>
            <button
              id="hero-learn-btn"
              className="apple-link text-[17px] inline-flex items-center gap-1"
            >
              Learn more
              <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </section>

      {/* ─── Features Grid ──────────────────────────────── */}
      <section className="py-6" id="features-section">
        <div className="apple-section-wide">
          <div className="grid md:grid-cols-3 gap-4">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                id={`feature-card-${i}`}
                className="group rounded-[20px] bg-bg-secondary p-8 sm:p-10 transition-transform duration-300 hover:scale-[1.02] animate-slide-up"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                {/* Icon */}
                <div className="w-11 h-11 rounded-full bg-bg-primary flex items-center justify-center mb-5 shadow-xs">
                  <feature.icon className="w-5 h-5 text-label-secondary" strokeWidth={1.5} />
                </div>

                {/* Title */}
                <h2 className="text-[28px] sm:text-[32px] font-semibold tracking-tight leading-[1.1] text-label-primary mb-1">
                  {feature.title}
                </h2>

                {/* Subtitle */}
                <p className="text-[17px] font-normal text-label-secondary leading-[1.38] mb-3">
                  {feature.subtitle}
                </p>

                {/* Description */}
                <p className="text-[15px] font-normal text-label-quaternary leading-[1.47] mb-5">
                  {feature.description}
                </p>

                {/* Link */}
                <span className="apple-link text-[15px] inline-flex items-center gap-0.5 group-hover:gap-1.5 transition-all duration-200">
                  {feature.linkText}
                  <ChevronRight className="w-3.5 h-3.5" strokeWidth={2.5} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Trust Strip ─────────────────────────────────── */}
      <section className="py-12 sm:py-16 mt-4" id="trust-section">
        <div className="apple-section">
          <div className="grid sm:grid-cols-3 gap-8 sm:gap-10">
            {[
              { icon: Truck, title: 'Free Delivery', desc: 'On orders over $50.' },
              { icon: Shield, title: 'Secure Payments', desc: 'End-to-end encryption.' },
              { icon: Zap, title: 'Same-Day Repair', desc: 'Walk in or book online.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-bg-secondary flex items-center justify-center flex-shrink-0">
                  <Icon className="w-[18px] h-[18px] text-label-tertiary" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold text-label-primary leading-tight mb-0.5">
                    {title}
                  </h3>
                  <p className="text-[13px] text-label-quaternary">
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
