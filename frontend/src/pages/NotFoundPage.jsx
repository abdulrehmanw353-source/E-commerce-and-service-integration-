import { Home, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center px-6 animate-fade-in">
        {/* 404 */}
        <h1 className="text-[120px] sm:text-[180px] font-bold tracking-[-0.05em] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 leading-none mb-4 drop-shadow-[0_0_40px_rgba(255,255,255,0.1)]">
          404
        </h1>

        {/* Message */}
        <h2 className="text-[32px] sm:text-[40px] font-bold tracking-[-0.03em] text-white mb-4">
          Page not found.
        </h2>
        <p className="text-[19px] sm:text-[21px] text-white/60 font-medium max-w-[440px] mx-auto mb-12 leading-[1.4]">
          The page you're looking for doesn't exist or has been moved to another universe.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            id="not-found-home-btn"
            className="flex items-center justify-center gap-2 px-8 py-3.5 bg-[#7a5cff] text-white rounded-full text-[15px] font-bold hover:bg-[#8c72ff] transition-all shadow-[0_0_20px_rgba(122,92,255,0.25)] hover:shadow-[0_0_25px_rgba(122,92,255,0.4)]"
          >
            <Home className="w-[18px] h-[18px]" strokeWidth={2.5} />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            id="not-found-back-btn"
            className="flex items-center justify-center gap-2 px-8 py-3.5 bg-white/5 border border-white/10 text-white rounded-full text-[15px] font-bold hover:bg-white/10 transition-all"
          >
            <ArrowLeft className="w-[18px] h-[18px]" strokeWidth={2.5} />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
