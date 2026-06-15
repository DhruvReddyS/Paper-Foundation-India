import Link from "next/link";

// Placeholder press release detail page
export default function PressReleaseDetailPage() {
  return (
    <main className="bg-paper-warm min-h-screen">
      <article className="max-w-3xl mx-auto px-6 py-20">
        <Link
          href="/newsroom"
          className="inline-flex items-center gap-2 text-sm text-forest font-medium mb-8 hover:underline"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Newsroom
        </Link>

        <span className="inline-block px-3 py-1 rounded-full bg-copper/10 text-copper text-xs font-bold uppercase mb-4">
          Press Release
        </span>

        <h1 className="text-3xl md:text-4xl font-serif font-bold text-charcoal mb-4">
          Paper Foundation India Launches National Sustainability Campaign
        </h1>

        <div className="flex items-center gap-4 text-sm text-charcoal/50 mb-8">
          <time>May 15, 2024</time>
          <span>•</span>
          <span>New Delhi, India</span>
        </div>

        <div className="prose prose-lg max-w-none text-charcoal/80 leading-relaxed space-y-6">
          <p>
            <strong>New Delhi, May 15, 2024</strong> — Paper Foundation India today
            announced the launch of its most ambitious initiative to date: a nationwide
            sustainability awareness campaign reaching 50 cities across India.
          </p>

          <p>
            The campaign, titled &ldquo;Paper is Renewable,&rdquo; aims to educate citizens
            about the environmental credentials of sustainably produced paper, including
            its renewable nature, high recyclability, and role in supporting managed forests.
          </p>

          <h2 className="text-xl font-bold text-charcoal mt-8 mb-4">Key Highlights</h2>

          <ul className="list-disc pl-6 space-y-2">
            <li>50-city roadshow with interactive exhibits and workshops</li>
            <li>Partnership with 200+ schools for hands-on sustainability education</li>
            <li>Launch of the &ldquo;Paper Trail&rdquo; mobile app for tracking paper&apos;s journey</li>
            <li>Industry-wide pledge for 100% sustainable sourcing by 2030</li>
          </ul>

          <h2 className="text-xl font-bold text-charcoal mt-8 mb-4">About Paper Foundation India</h2>

          <p>
            Paper Foundation India is India&apos;s leading independent voice on paper sustainability.
            We provide evidence-based information, debunk myths, and promote informed decision-making
            about paper and its role in a sustainable future.
          </p>

          <div className="bg-sage/5 rounded-xl p-6 border border-sage/15 mt-8">
            <h3 className="text-lg font-bold text-charcoal mb-2">Media Contact</h3>
            <p className="text-sm">
              Dr. Priya Sharma, Editor-in-Chief<br />
              Email: press@paperfoundation.in<br />
              Phone: +91 98765 43210
            </p>
          </div>
        </div>
      </article>
    </main>
  );
}
