import { Home, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-white">
      <div className="text-center px-6 animate-fade-in">
        {/* 404 */}
        <h1 className="text-[120px] sm:text-[180px] font-bold tracking-[-0.05em] text-transparent bg-clip-text bg-gradient-to-b from-[#1D1D1F] to-[#86868B] leading-none mb-4 drop-shadow-sm">
          404
        </h1>

        {/* Message */}
        <h2 className="text-[32px] sm:text-[40px] font-bold tracking-[-0.03em] text-[#1D1D1F] mb-4">
          Page not found.
        </h2>
        <p className="text-[19px] sm:text-[21px] text-[#86868B] font-medium max-w-[440px] mx-auto mb-12 leading-[1.4]">
          The page you're looking for doesn't exist or has been moved to another universe.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            id="not-found-home-btn"
            className="apple-btn apple-btn-primary px-8 py-3.5 text-[17px] shadow-[0_4px_14px_rgba(0,113,227,0.3)] hover:shadow-[0_6px_20px_rgba(0,113,227,0.4)]"
          >
            <Home className="w-[18px] h-[18px]" strokeWidth={1.5} />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            id="not-found-back-btn"
            className="apple-btn bg-[#F5F5F7] text-[#1D1D1F] px-8 py-3.5 text-[17px] hover:bg-[#E8E8ED]"
          >
            <ArrowLeft className="w-[18px] h-[18px]" strokeWidth={1.5} />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
