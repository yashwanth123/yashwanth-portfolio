import { siteConfig } from "@/lib/site-config";
import { GhostButton } from "@/components/ui/GhostButton";

export function ContactSection() {
  return (
    <section id="contact" className="relative px-6 py-24 md:px-10 md:py-32">
      <div className="section-divider mx-auto mb-20 max-w-[1400px]" />
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="mb-4 text-[11px] tracking-[0.28em] text-white/45 uppercase">
              Contact
            </p>
            <h2 className="max-w-2xl font-serif text-3xl leading-tight text-white md:text-5xl">
              Let&apos;s build something memorable together.
            </h2>
          </div>

          <div className="flex flex-col gap-6 lg:col-span-5">
            <div className="flex flex-col gap-2">
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-lg text-white/70 transition-colors hover:text-white md:text-xl"
              >
                {siteConfig.email}
              </a>
              <a
                href={`tel:${siteConfig.phone.replace(/\D/g, "")}`}
                className="text-sm tracking-wide text-white/45 transition-colors hover:text-white/70"
              >
                {siteConfig.phone}
              </a>
            </div>

            <div className="flex flex-wrap gap-4">
              <GhostButton href={siteConfig.social.github} external>
                GitHub
              </GhostButton>
              <GhostButton href={siteConfig.social.linkedin} external>
                LinkedIn
              </GhostButton>
              <GhostButton href="#projects" variant="secondary">
                Projects
              </GhostButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/8 px-6 py-8 md:px-10">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-3 text-[11px] tracking-[0.14em] text-white/30 uppercase sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} {siteConfig.name}</p>
        <p>Built with Next.js · Tailwind · React Three Fiber</p>
      </div>
    </footer>
  );
}
