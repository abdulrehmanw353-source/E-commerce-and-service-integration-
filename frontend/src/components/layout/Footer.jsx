import { Link } from 'react-router-dom';
import { Wrench, ChevronRight } from 'lucide-react';

export default function Footer() {
  const footerLinks = {
    'Shop & Order': [
      { label: 'All Products', to: '/products' },
      { label: 'Checkout', to: '/checkout' },
      { label: 'My Orders', to: '/account/orders' },
    ],
    'Electronics Repair': [
      { label: 'Book a Repair', to: '/services' },
      { label: 'My Bookings', to: '/account/bookings' },
      { label: 'Service Status', to: '/account/bookings' },
    ],
    'Account': [
      { label: 'Sign In', to: '/login' },
      { label: 'Create Account', to: '/register' },
      { label: 'My Profile', to: '/account' },
    ],
    'Support': [
      { label: 'Live Chat', to: '/account' },
      { label: 'Help Center', to: '/account' },
      { label: 'Support Status', to: '/account' },
    ],
  };

  return (
    <footer className="border-t border-white/10 bg-[#0b0f1d] mt-auto" id="main-footer">
      <div className="apple-section-wide">

        {/* Repair Service Mini Banner */}
        <div className="py-10 border-b border-white/10">
          <Link
            to="/services"
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 group ds-card p-6 sm:p-8 hover:border-[#8f74ff]/40 transition-all duration-300"
          >
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-[#7a5cff]/20 border border-[#7a5cff]/45 flex items-center justify-center flex-shrink-0 shadow-[0_0_18px_rgba(122,92,255,0.35)] group-hover:scale-105 transition-transform duration-300">
                <Wrench className="w-[24px] h-[24px] text-white" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-[18px] font-semibold text-white tracking-[-0.01em] mb-1">Need a device repaired?</p>
                <p className="text-[13px] text-white/55 font-medium">Book expert repair service for your phone, laptop, PC or tablet.</p>
              </div>
            </div>
            <div className="flex items-center px-5 py-2.5 rounded-xl font-semibold text-[13px] transition-all duration-300 ds-btn-primary">
              Book now <ChevronRight className="w-4 h-4 ml-1" strokeWidth={2.5} />
            </div>
          </Link>
        </div>

        {/* Link Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-[11px] font-semibold text-white/60 mb-4 tracking-[0.12em] uppercase">
                {category}
              </h4>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-[13px] text-white/55 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-6 flex flex-col-reverse md:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-white/40">
            Copyright &copy; {new Date().getFullYear()} DoorSetFix. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {['Privacy Policy', 'Terms of Use', 'Sales and Refunds', 'Legal'].map((link) => (
              <button
                key={link}
                className="text-[12px] text-white/40 hover:text-white transition-colors"
              >
                {link}
              </button>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
