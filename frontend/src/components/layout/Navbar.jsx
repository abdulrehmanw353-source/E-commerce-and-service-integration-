import { Link } from 'react-router-dom';
import { ShoppingBag, Menu } from 'lucide-react';

export default function Navbar({ onOpenSidebar }) {
  return (
    <nav className="sticky top-0 z-50 apple-glass border-b border-separator" id="main-nav">
      <div className="apple-section-wide">
        <div className="flex items-center justify-between h-[48px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1.5" id="nav-logo">
            <span className="text-[21px] font-semibold tracking-tight text-label-primary">
              TechStore
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-7">
            {['Products', 'Services', 'Support'].map((item) => (
              <button
                key={item}
                id={`nav-${item.toLowerCase()}`}
                className="text-[13px] font-normal text-label-secondary hover:text-label-primary transition-colors duration-200"
              >
                {item}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-5">
            <button
              id="nav-signin"
              className="hidden sm:block text-[13px] font-normal text-apple-blue hover:text-[#0071E3] transition-colors"
            >
              Sign In
            </button>
            <button
              id="nav-bag"
              className="text-label-secondary hover:text-label-primary transition-colors"
            >
              <ShoppingBag className="w-[18px] h-[18px]" strokeWidth={1.5} />
            </button>
            
            {/* Mobile Menu Toggle */}
            <button
              onClick={onOpenSidebar}
              className="md:hidden text-label-secondary hover:text-label-primary transition-colors"
            >
              <Menu className="w-[18px] h-[18px]" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
