export default function Footer() {
  return (
    <footer className="border-t border-separator py-6 mt-auto bg-bg-primary" id="main-footer">
      <div className="apple-section-wide">
        {/* Breadcrumb-style links */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4">
          {['Products', 'Services', 'Support', 'About', 'Contact'].map((link) => (
            <button
              key={link}
              className="text-[12px] text-label-quaternary hover:text-label-primary transition-colors"
            >
              {link}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-separator mb-4" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="text-[12px] text-label-quaternary">
            Copyright &copy; {new Date().getFullYear()} TechStore. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {['Privacy Policy', 'Terms of Use'].map((link) => (
              <button
                key={link}
                className="text-[12px] text-label-quaternary hover:text-label-primary transition-colors"
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
