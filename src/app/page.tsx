import { Navigation } from "@/components/Navigation";
import { CornerFrames } from "@/components/CornerFrames";
import { Hero } from "@/components/Hero";
import { AboutSection } from "@/components/AboutSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { BlogSection } from "@/components/BlogSection";
import { ContactSection, Footer } from "@/components/ContactSection";
import { fetchGitHubRepos, type GitHubRepo } from "@/lib/github";
import { siteConfig } from "@/lib/site-config";

export default async function Home() {
  let repos: GitHubRepo[] = [];

  try {
    repos = await fetchGitHubRepos(siteConfig.githubUsername);
  } catch {
    repos = [];
  }

  return (
    <>
      <Navigation />
      <CornerFrames />
      <main>
        <Hero />
        <AboutSection />
        <ProjectsSection repos={repos} />
        <BlogSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
