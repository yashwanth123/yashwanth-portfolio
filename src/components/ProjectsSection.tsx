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
    loading: () => <div className="project-visual-fallback absolute inset-0" />,
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

function ProjectCard({ project }: { project: DisplayProject }) {
  return (
    <a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      className="project-card group flex h-[430px] flex-col overflow-hidden rounded-2xl border border-cyan-200/35 bg-[#1a4d5f] shadow-[0_10px_40px_rgba(8,145,178,0.12)] transition-all duration-300 hover:-translate-y-1 hover:border-cyan-100/60 hover:bg-[#1f5a6e] hover:shadow-[0_18px_50px_rgba(34,211,238,0.28)] md:h-[450px]"
    >
      <div className="project-visual-frame relative h-[200px] w-full shrink-0 overflow-hidden border-b border-cyan-100/20 md:h-[220px]">
        <ProjectScene visual={project.visual} />
        <div className="project-visual-vignette pointer-events-none absolute inset-0" />
        {project.featured && (
          <span className="absolute top-3 left-3 rounded-full border border-cyan-100/40 bg-[#0b2a36]/75 px-3 py-1 text-[10px] tracking-[0.2em] text-cyan-50 uppercase backdrop-blur-sm">
            Featured
          </span>
        )}
        <span
          aria-hidden
          className="absolute top-3 right-3 text-cyan-50/70 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white"
        >
          ↗
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col bg-[#123846] p-5 md:p-6">
        <h3 className="font-serif text-[1.35rem] leading-tight text-white transition-colors group-hover:text-cyan-50">
          {project.title}
        </h3>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-cyan-50/80">
          {project.blurb}
        </p>

        <div className="mt-auto pt-5">
          <div className="flex flex-wrap items-center gap-2">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-cyan-100/25 bg-cyan-50/10 px-3 py-1 text-[10px] tracking-[0.12em] text-cyan-50 uppercase"
              >
                {tag}
              </span>
            ))}
            {project.language && !project.tags.includes(project.language) && (
              <span className="rounded-full border border-cyan-100/25 bg-cyan-50/10 px-3 py-1 text-[10px] tracking-[0.12em] text-cyan-50 uppercase">
                {project.language}
              </span>
            )}
          </div>

          <div className="mt-4 flex items-center gap-4 text-[11px] tracking-[0.12em] text-cyan-100/55 uppercase">
            <span>★ {project.stars}</span>
            <span>Forks {project.forks}</span>
            {project.liveHref ? (
              <span className="text-amber-200/90">Live</span>
            ) : null}
          </div>
        </div>
      </div>
    </a>
  );
}

export function ProjectsSection({ repos }: ProjectsSectionProps) {
  const { featured, more } = buildProjects(repos);

  return (
    <section
      id="projects"
      className="projects-section relative px-6 py-24 md:px-10 md:py-32"
    >
      <div className="section-divider mx-auto mb-20 max-w-[1400px]" />
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-4 text-[11px] tracking-[0.28em] text-cyan-200 uppercase">
              GitHub Projects
            </p>
            <h2 className="font-serif text-3xl text-white md:text-4xl">
              Visual systems from the lab
            </h2>
          </div>
          <p className="max-w-sm text-sm text-cyan-50/70">
            Six featured builds in a fixed desktop grid — each with a live 3D
            motif synced from GitHub.
          </p>
        </div>

        {featured.length === 0 && more.length === 0 ? (
          <p className="text-sm text-cyan-50/70">
            No public repositories found. Check back soon.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {featured.map((project) => (
                <ProjectCard key={project.key} project={project} />
              ))}
            </div>

            {more.length > 0 && (
              <div className="mt-16">
                <div className="mb-8 flex items-end justify-between gap-4">
                  <h3 className="font-serif text-2xl text-white">
                    More repositories
                  </h3>
                  <a
                    href={siteConfig.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] tracking-[0.18em] text-cyan-100/60 uppercase transition-colors hover:text-cyan-50"
                  >
                    View GitHub ↗
                  </a>
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
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
