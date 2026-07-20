import { NextResponse } from "next/server";
import { fetchGitHubRepos } from "@/lib/github";
import { siteConfig } from "@/lib/site-config";

export async function GET() {
  try {
    const repos = await fetchGitHubRepos(siteConfig.githubUsername);
    return NextResponse.json(repos);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch repos" },
      { status: 500 },
    );
  }
}
