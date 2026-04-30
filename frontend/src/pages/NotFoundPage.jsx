import { Home, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary">
      <div className="text-center px-6 animate-fade-in">
        {/* 404 */}
        <h1 className="text-[80px] sm:text-[96px] font-semibold tracking-tight text-label-quaternary leading-none mb-2">
          404
        </h1>

        {/* Message */}
        <h2 className="text-[24px] sm:text-[28px] font-semibold tracking-tight text-label-primary mb-2">
          Page not found.
        </h2>
        <p className="text-[17px] text-label-secondary max-w-[400px] mx-auto mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            id="not-found-home-btn"
            className="apple-btn apple-btn-primary px-6 py-2.5 text-[15px]"
          >
            <Home className="w-4 h-4" strokeWidth={1.5} />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            id="not-found-back-btn"
            className="apple-btn apple-btn-secondary px-6 py-2.5 text-[15px]"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
