import { siteConfig } from "@/lib/site-config";

export function AboutSection() {
  return (
    <section id="about" className="relative px-6 py-24 md:px-10 md:py-32">
      <div className="section-divider mx-auto mb-20 max-w-[1400px]" />
      <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <p className="mb-4 text-[11px] tracking-[0.28em] text-white/45 uppercase">
            About Me
          </p>
          <h2 className="font-serif text-3xl leading-tight text-white md:text-4xl">
            {siteConfig.about.title}
          </h2>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-8">
          {siteConfig.about.paragraphs.map((paragraph) => (
            <p
              key={paragraph.slice(0, 24)}
              className="max-w-2xl text-sm leading-7 text-white/55 md:text-[15px] md:leading-8"
            >
              {paragraph}
            </p>
          ))}

          <div className="mt-4 flex flex-wrap gap-2">
            {siteConfig.about.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-white/10 px-4 py-2 text-[11px] tracking-[0.12em] text-white/60 uppercase"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
