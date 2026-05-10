import { ChevronRight, ShoppingBag, Wrench, Zap, Hammer, Wind } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const serviceIcons = [
    { label: 'Plumbing', icon: Wrench },
    { label: 'Electrical', icon: Zap },
    { label: 'Carpentry', icon: Hammer },
    { label: 'HVAC', icon: Wind },
  ];

  return (
    <div className="py-10 sm:py-14">
      <div className="apple-section-wide">
        <section className="ds-shell p-4 sm:p-6">
          <div className="rounded-[20px] overflow-hidden relative border border-white/15 min-h-[470px]">
            <img
              src="/hero-bg.png"
              alt="Service technician"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0d18]/35 via-[#0a0d18]/45 to-[#0a0d18]/78" />
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-4 sm:px-10">
              <div className="mx-auto max-w-[780px] rounded-[26px] border border-white/20 bg-[#12182a]/62 backdrop-blur-[12px] p-6 sm:p-9 text-center">
                <h1 className="text-white text-[40px] sm:text-[58px] font-extrabold tracking-[-0.03em] leading-[1.02]">
                  Your Home, Our Priority
                </h1>
                <p className="text-white/75 mt-3 text-[16px] sm:text-[20px]">
                  Reliable home repair services and essential accessories delivered to your door.
                </p>
                <div className="mt-7 flex flex-col sm:flex-row justify-center gap-3">
                  <Link to="/services" className="px-7 py-3 rounded-full font-semibold ds-btn-primary inline-flex items-center justify-center gap-2">
                    Book a Service <ChevronRight className="w-4 h-4" />
                  </Link>
                  <Link to="/products" className="px-7 py-3 rounded-full font-semibold bg-white text-[#101322] border border-white/20 inline-flex items-center justify-center gap-2">
                    Shop Accessories <ShoppingBag className="w-4 h-4" />
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
    </div>
  );
}
