import type { GitHubRepo } from "@/lib/github";

type ProjectsSectionProps = {
  repos: GitHubRepo[];
};

export function ProjectsSection({ repos }: ProjectsSectionProps) {
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
              All repositories
            </h2>
          </div>
          <p className="max-w-sm text-sm text-white/45">
            All public repositories from GitHub, sorted by last updated.
          </p>
        </div>

        {repos.length === 0 ? (
          <p className="text-sm text-white/45">
            No public repositories found. Check back soon.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {repos.map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col justify-between rounded-2xl border border-white/8 bg-white/[0.02] p-6 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.04]"
              >
                <div>
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <h3 className="font-medium text-white transition-colors group-hover:text-cyan-300">
                      {repo.name}
                      {repo.fork && (
                        <span className="ml-2 text-[10px] tracking-[0.12em] text-white/30 uppercase">
                          Fork
                        </span>
                      )}
                    </h3>
                    <span
                      aria-hidden
                      className="text-white/30 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    >
                      ↗
                    </span>
                  </div>
                  <p className="line-clamp-3 text-sm leading-6 text-white/45">
                    {repo.description || "No description provided."}
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-4 text-[11px] tracking-[0.1em] text-white/35 uppercase">
                  {repo.language && <span>{repo.language}</span>}
                  <span>★ {repo.stargazers_count}</span>
                  <span>Forks {repo.forks_count}</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
