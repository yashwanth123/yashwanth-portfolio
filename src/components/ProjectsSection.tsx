"use client";

import dynamic from "next/dynamic";
import type { GitHubRepo } from "@/lib/github";
import {
  siteConfig,
  type FeaturedProject,
  type ProjectVisual,
} from "@/lib/site-config";
import { visualFromName } from "@/components/ProjectScene";

const ProjectScene = dynamic(
  () => import("@/components/ProjectScene").then((mod) => mod.ProjectScene),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(34,211,238,0.16),transparent_60%)]" />
    ),
  },
);

type ProjectsSectionProps = {
  repos: GitHubRepo[];
};

type DisplayProject = {
  key: string;
  title: string;
  blurb: string;
  href: string;
  liveHref?: string | null;
  language: string | null;
  stars: number;
  forks: number;
  visual: ProjectVisual;
  tags: string[];
  featured: boolean;
};

function buildProjects(repos: GitHubRepo[]): {
  featured: DisplayProject[];
  more: DisplayProject[];
} {
  const byName = new Map(repos.map((repo) => [repo.name, repo]));
  const featuredNames = new Set(
    siteConfig.featuredProjects.map((project) => project.repo),
  );

  const featured: DisplayProject[] = siteConfig.featuredProjects.map(
    (project: FeaturedProject) => {
      const repo = byName.get(project.repo);
      return {
        key: project.repo,
        title: project.title,
        blurb: project.blurb,
        href:
          project.href ||
          repo?.html_url ||
          `https://github.com/${siteConfig.githubUsername}/${project.repo}`,
        liveHref: repo?.homepage,
        language: repo?.language ?? project.tags[0] ?? null,
        stars: repo?.stargazers_count ?? 0,
        forks: repo?.forks_count ?? 0,
        visual: project.visual,
        tags: [...project.tags],
        featured: true,
      };
    },
  );

  const more = repos
    .filter((repo) => !featuredNames.has(repo.name))
    .filter((repo) => repo.name !== siteConfig.githubUsername)
    .filter((repo) => repo.name !== "yashwanth-portfolio")
    .map((repo) => ({
      key: repo.name,
      title: repo.name,
      blurb: repo.description || "Exploration and experiments from the GitHub lab.",
      href: repo.html_url,
      liveHref: repo.homepage,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      visual: visualFromName(repo.name),
      tags: repo.topics.slice(0, 3),
      featured: false,
    }));

  return { featured, more };
}

function ProjectCard({
  project,
  large = false,
}: {
  project: DisplayProject;
  large?: boolean;
}) {
  return (
    <a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#061018]/70 transition-all duration-500 hover:border-cyan-300/30 hover:bg-[#071520]/85 ${
        large ? "min-h-[360px] md:min-h-[420px]" : "min-h-[300px]"
      }`}
    >
      <div className="absolute inset-0 opacity-90 transition-opacity duration-500 group-hover:opacity-100">
        <ProjectScene visual={project.visual} />
      </div>
      <div className="project-card-shade absolute inset-0" />

      <div className="relative z-10 flex h-full flex-col justify-between p-6 md:p-7">
        <div className="flex items-start justify-between gap-3">
          <div>
            {project.featured && (
              <p className="mb-3 text-[10px] tracking-[0.28em] text-cyan-300/70 uppercase">
                Featured
              </p>
            )}
            <h3
              className={`font-serif text-white transition-colors group-hover:text-cyan-200 ${
                large ? "text-2xl md:text-3xl" : "text-xl"
              }`}
            >
              {project.title}
            </h3>
          </div>
          <span
            aria-hidden
            className="text-white/35 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-cyan-300"
          >
            ↗
          </span>
        </div>

        <div>
          <p
            className={`max-w-md text-sm leading-6 text-white/60 ${
              large ? "md:text-[15px] md:leading-7" : "line-clamp-3"
            }`}
          >
            {project.blurb}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[10px] tracking-[0.14em] text-white/50 uppercase"
              >
                {tag}
              </span>
            ))}
            {project.language && !project.tags.includes(project.language) && (
              <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[10px] tracking-[0.14em] text-white/50 uppercase">
                {project.language}
              </span>
            )}
          </div>

          <div className="mt-4 flex items-center gap-4 text-[11px] tracking-[0.12em] text-white/35 uppercase">
            <span>★ {project.stars}</span>
            <span>Forks {project.forks}</span>
            {project.liveHref ? <span>Live</span> : null}
          </div>
        </div>
      </div>
    </a>
  );
}

export function ProjectsSection({ repos }: ProjectsSectionProps) {
  const { featured, more } = buildProjects(repos);
  const [primary, ...restFeatured] = featured;

  return (
    <section id="projects" className="relative px-6 py-24 md:px-10 md:py-32">
      <div className="section-divider mx-auto mb-20 max-w-[1400px]" />
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-4 text-[11px] tracking-[0.28em] text-white/45 uppercase">
              GitHub Projects
            </p>
            <h2 className="font-serif text-3xl text-white md:text-4xl">
              Visual systems from the lab
            </h2>
          </div>
          <p className="max-w-sm text-sm text-white/45">
            Featured builds with live 3D motifs — synced from GitHub and curated
            for clarity.
          </p>
        </div>

        {featured.length === 0 && more.length === 0 ? (
          <p className="text-sm text-white/45">
            No public repositories found. Check back soon.
          </p>
        ) : (
          <>
            {primary && (
              <div className="mb-4 grid gap-4 lg:grid-cols-12">
                <div className="lg:col-span-7">
                  <ProjectCard project={primary} large />
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
                  {restFeatured.slice(0, 2).map((project) => (
                    <ProjectCard key={project.key} project={project} />
                  ))}
                </div>
              </div>
            )}

            {restFeatured.length > 2 && (
              <div className="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {restFeatured.slice(2).map((project) => (
                  <ProjectCard key={project.key} project={project} />
                ))}
              </div>
            )}

            {more.length > 0 && (
              <div className="mt-16">
                <div className="mb-8 flex items-end justify-between gap-4">
                  <h3 className="font-serif text-2xl text-white/90">
                    More repositories
                  </h3>
                  <a
                    href={siteConfig.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] tracking-[0.18em] text-white/40 uppercase transition-colors hover:text-cyan-300"
                  >
                    View GitHub ↗
                  </a>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {more.map((project) => (
                    <ProjectCard key={project.key} project={project} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
