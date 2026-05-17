import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    // Temporarily disable CSS smooth scrolling
    document.documentElement.style.scrollBehavior = 'auto';
    
    // Scroll to top instantly before the browser paints the new frame
    window.scrollTo(0, 0);
    
    // Restore smooth scrolling for normal page interactions
    setTimeout(() => {
      document.documentElement.style.scrollBehavior = '';
    }, 0);
  }, [pathname]);

  return null;
}
