import { Loader2 } from 'lucide-react';

/**
 * Full-screen loading screen — Apple style.
 * Clean white background with a subtle spinner.
 */
export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg-primary">
      <div className="flex flex-col items-center gap-5 animate-fade-in">
        {/* Spinner */}
        <Loader2
          className="w-8 h-8 text-label-quaternary animate-spin"
          strokeWidth={1.5}
        />

        {/* Brand */}
        <p className="text-[13px] font-normal text-label-quaternary tracking-wide">
          Loading...
        </p>
      </div>
    </div>
  );
}
