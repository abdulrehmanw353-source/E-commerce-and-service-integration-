import { Link } from 'react-router-dom';
import { Wrench, ChevronRight } from 'lucide-react';

export default function Footer() {
  const footerLinks = {
    'Shop & Order': [
      { label: 'All Products', to: '/products' },
      { label: 'My Cart', to: '/cart' },
      { label: 'My Orders', to: '/account/orders' },
    ],
    'Repair Services': [
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
      { label: 'Contact Us', to: '/support' },
      { label: 'Live Chat', to: '/support' },
      { label: 'FAQ', to: '/support' },
    ],
  };

  return (
    <footer className="border-t border-[#D2D2D7] bg-[#F5F5F7]" id="main-footer">
      <div className="apple-section-wide">

        {/* Repair Service Mini Banner */}
        <div className="py-5 border-b border-[#D2D2D7]">
          <Link
            to="/services"
            className="flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#1D1D1F] flex items-center justify-center flex-shrink-0">
                <Wrench className="w-4 h-4 text-white" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-[#1D1D1F]">Need a repair?</p>
                <p className="text-[12px] text-[#86868B]">Book expert repair service for your device.</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#86868B] group-hover:text-[#1D1D1F] transition-colors" strokeWidth={2} />
          </Link>
        </div>

        {/* Link Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 py-8">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-[12px] font-semibold text-[#1D1D1F] mb-3 tracking-[0.01em]">
                {category}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-[12px] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors"
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
        <div className="border-t border-[#D2D2D7] py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <p className="text-[12px] text-[#6E6E73]">
              Copyright &copy; {new Date().getFullYear()} TechStore. All rights reserved.
            </p>
            <div className="flex items-center gap-5">
              {['Privacy Policy', 'Terms of Use'].map((link) => (
                <button
                  key={link}
                  className="text-[12px] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors"
                >
                  {link}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
