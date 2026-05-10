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
    <footer className="border-t border-[#D2D2D7] bg-[#F5F5F7] mt-auto" id="main-footer">
      <div className="apple-section-wide">

        {/* Repair Service Mini Banner */}
        <div className="py-10 border-b border-[#D2D2D7]">
          <Link
            to="/services"
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 group bg-white rounded-[24px] p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-[#E8E8ED] hover:border-transparent transition-all duration-300"
          >
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-full bg-[#1D1D1F] flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300">
                <Wrench className="w-[24px] h-[24px] text-white" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[20px] font-semibold text-[#1D1D1F] tracking-[-0.01em] mb-1">Need a repair?</p>
                <p className="text-[15px] text-[#86868B] font-medium">Book expert repair service for your device.</p>
              </div>
            </div>
            <div className="flex items-center bg-[#F5F5F7] group-hover:bg-apple-blue group-hover:text-white px-5 py-2.5 rounded-full text-[#1D1D1F] font-medium text-[15px] transition-all duration-300">
              Book now <ChevronRight className="w-4 h-4 ml-1" strokeWidth={2.5} />
            </div>
          </Link>
        </div>

        {/* Link Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-[13px] font-semibold text-[#1D1D1F] mb-4 tracking-[0.02em] uppercase">
                {category}
              </h4>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-[14px] text-[#6E6E73] hover:text-[#1D1D1F] hover:underline underline-offset-2 transition-colors"
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
        <div className="border-t border-[#D2D2D7] py-6 flex flex-col-reverse md:flex-row items-center justify-between gap-4">
          <p className="text-[13px] text-[#86868B]">
            Copyright &copy; {new Date().getFullYear()} TechStore Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {['Privacy Policy', 'Terms of Use', 'Sales and Refunds', 'Legal'].map((link) => (
              <button
                key={link}
                className="text-[13px] text-[#86868B] hover:text-[#1D1D1F] transition-colors"
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
