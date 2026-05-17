

export default function StaticPage({ title, content }) {
  return (
    <div className="min-h-screen py-16">
      <div className="apple-section-wide max-w-4xl mx-auto px-6">
        <div className="ds-card p-10 rounded-[32px]">
          <h1 className="text-[36px] font-bold tracking-[-0.03em] text-white mb-8 border-b border-white/10 pb-6">
            {title}
          </h1>
          <div className="prose prose-invert max-w-none prose-p:text-white/70 prose-headings:text-white prose-a:text-[#7a5cff]">
            {content.map((paragraph, index) => (
              <p key={index} className="text-[16px] leading-relaxed mb-6">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
