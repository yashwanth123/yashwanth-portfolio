import { siteConfig } from "@/lib/site-config";

export function BlogSection() {
  return (
    <section id="blog" className="relative px-6 py-24 md:px-10 md:py-32">
      <div className="section-divider mx-auto mb-20 max-w-[1400px]" />
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-14">
          <p className="mb-4 text-[11px] tracking-[0.28em] text-white/45 uppercase">
            Reading List
          </p>
          <h2 className="font-serif text-3xl text-white md:text-4xl">
            Ideas shaping AI engineering
          </h2>
          <p className="mt-4 max-w-xl text-sm text-white/45">
            High-signal essays from OpenAI, Anthropic, and Stanford HAI —
            curated reads that inform how I build agentic systems.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {siteConfig.blogPosts.map((post) => (
            <article
              key={post.href}
              className="group rounded-2xl border border-white/8 bg-white/[0.02] p-6 transition-all duration-300 hover:border-cyan-400/25 hover:bg-white/[0.04]"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] tracking-[0.18em] text-cyan-300/70 uppercase">
                  {post.source}
                </span>
                <time className="text-[11px] tracking-[0.12em] text-white/35 uppercase">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                  })}
                </time>
              </div>
              <h3 className="mt-3 font-serif text-xl text-white transition-colors group-hover:text-cyan-100">
                {post.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-white/45">{post.excerpt}</p>
              <a
                href={post.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 text-[11px] tracking-[0.18em] text-white/50 uppercase transition-colors hover:text-cyan-300"
              >
                Read on {post.source.split(" ")[0]}
                <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                  ↗
                </span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
