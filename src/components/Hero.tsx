"use client";

import dynamic from "next/dynamic";
import { siteConfig } from "@/lib/site-config";
import { GhostButton } from "@/components/ui/GhostButton";

const HeroScene = dynamic(
  () => import("@/components/HeroScene").then((mod) => mod.HeroScene),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-gradient-to-br from-purple-950/20 to-transparent" />
    ),
  },
);

function Headline() {
  const parts = siteConfig.headline.split(siteConfig.headlineEmphasis);

  return (
    <h1 className="max-w-2xl font-serif text-[clamp(2.5rem,6vw,4.75rem)] leading-[1.05] tracking-[-0.02em] text-white">
      {parts[0]}
      <em className="font-serif italic text-white/95">
        {siteConfig.headlineEmphasis}
      </em>
      {parts[1]}
    </h1>
  );
}

export function Hero() {
  return (
    <section className="hero-gradient starfield relative flex min-h-screen flex-col overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-70 md:opacity-100">
        <HeroScene />
      </div>

      <div className="pointer-events-none relative z-10 mx-auto flex min-h-screen w-full max-w-[1400px] flex-1 flex-col px-6 pt-28 pb-16 md:px-10 md:pt-36 md:pb-20">
        <div className="grid flex-1 grid-cols-1 items-end gap-12 lg:grid-cols-12 lg:items-center lg:gap-8">
          <div className="pointer-events-auto flex flex-col gap-8 lg:col-span-6 xl:col-span-5">
            <p className="animate-fade-up text-[11px] tracking-[0.28em] text-white/70 uppercase">
              {siteConfig.role}
            </p>

            <div className="animate-fade-up-delay-1">
              <Headline />
            </div>

            <div className="animate-fade-up-delay-2 flex flex-col gap-4 sm:flex-row sm:items-center">
              <GhostButton href="#projects">
                Explore Projects
              </GhostButton>
              <GhostButton href={siteConfig.social.github} external variant="secondary">
                GitHub
              </GhostButton>
            </div>
          </div>

          <div className="pointer-events-auto animate-fade-up-delay-3 lg:col-span-6 lg:col-start-7 xl:col-span-5 xl:col-start-8">
            <p className="max-w-md text-sm leading-7 text-white/55 lg:ml-auto lg:text-right lg:text-[15px] lg:leading-8">
              {siteConfig.heroDescription}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
