import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const REPO_NAME = "skillsaarthi-skill-gap-analysis";
const REPO_DESCRIPTION =
  "SkillSaarthi / Karmayogi — Skill Gap Analysis platform (synced from Lovable)";

// All app source files, inlined as raw text at build time.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sourceFiles = (import.meta as any).glob("/src/**/*", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const EXTRA_FILES: Record<string, string> = {
  "README.md": `# SkillSaarthi — Skill Gap Analysis

Karmayogi / SkillSaarthi competency platform featuring the Skill Gap Analysis page.

Synced automatically from the app via the "Sync to GitHub" button.
`,
};

async function github<T>(
  path: string,
  options: RequestInit = {},
): Promise<T | null> {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const githubKey = process.env["GITHUB_API_KEY"];
  if (!lovableKey || !githubKey) {
    throw new Error("GitHub connection is not configured.");
  }
  const res = await fetch(`https://connector-gateway.lovable.dev/github${path}`, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": githubKey,
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });
  if (res.status === 204) return null;
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub request failed [${res.status}]: ${body}`);
  }
  return (await res.json()) as T;
}

interface GhUser {
  login: string;
}

interface GhRepo {
  full_name: string;
  html_url: string;
  default_branch: string;
}

async function ensureRepo(): Promise<GhRepo> {
  const user = await github<GhUser>("/user");
  if (!user) throw new Error("Could not read your GitHub account.");
  try {
    const repo = await github<GhRepo>(`/repos/${user.login}/${REPO_NAME}`);
    if (repo) return repo;
  } catch {
    // Repo doesn't exist yet — create it below.
  }
  const created = await github<GhRepo>("/user/repos", {
    method: "POST",
    body: JSON.stringify({
      name: REPO_NAME,
      description: REPO_DESCRIPTION,
      private: false,
      auto_init: true,
    }),
  });
  if (!created) throw new Error("Failed to create the GitHub repository.");
  return created;
}

async function getFileSha(repo: GhRepo, path: string): Promise<string | undefined> {
  try {
    const existing = await github<{ sha: string }>(
      `/repos/${repo.full_name}/contents/${path}?ref=${repo.default_branch}`,
    );
    return existing?.sha;
  } catch {
    return undefined; // File doesn't exist yet.
  }
}

async function upsertFile(
  repo: GhRepo,
  path: string,
  content: string,
  message: string,
): Promise<void> {
  const body = (sha?: string) =>
    JSON.stringify({
      message,
      content: Buffer.from(content, "utf-8").toString("base64"),
      branch: repo.default_branch,
      ...(sha ? { sha } : {}),
    });
  let sha = await getFileSha(repo, path);
  try {
    await github(`/repos/${repo.full_name}/contents/${path}`, {
      method: "PUT",
      body: body(sha),
    });
  } catch (err) {
    // 409: the file changed between our sha lookup and the write — re-read and retry once.
    if (!(err instanceof Error) || !err.message.includes("[409]")) throw err;
    sha = await getFileSha(repo, path);
    await github(`/repos/${repo.full_name}/contents/${path}`, {
      method: "PUT",
      body: body(sha),
    });
  }
}

export const getGitHubStatus = createServerFn({ method: "GET" }).handler(
  async () => {
    const user = await github<GhUser>("/user");
    if (!user) throw new Error("Could not read your GitHub account.");
    let repo: GhRepo | null = null;
    try {
      repo = await github<GhRepo>(`/repos/${user.login}/${REPO_NAME}`);
    } catch {
      repo = null;
    }
    return {
      login: user.login,
      repoName: REPO_NAME,
      repoUrl: repo?.html_url ?? null,
      defaultBranch: repo?.default_branch ?? "main",
      zipUrl: repo
        ? `https://codeload.github.com/${repo.full_name}/zip/refs/heads/${repo.default_branch}`
        : null,
    };
  },
);

export const syncToGitHub = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({}).passthrough().parse(d ?? {}))
  .handler(async () => {
    const repo = await ensureRepo();
    const stamp = new Date().toISOString();
    const message = `Sync from SkillSaarthi app — ${stamp}`;

    const files: Record<string, string> = { ...EXTRA_FILES };
    for (const [path, content] of Object.entries(sourceFiles)) {
      // path looks like "/src/routes/index.tsx" → store as "src/routes/index.tsx"
      files[path.replace(/^\//, "")] = content;
    }

    const results: string[] = [];
    for (const [path, content] of Object.entries(files)) {
      if (typeof content !== "string") continue;
      await upsertFile(repo, path, content, message);
      results.push(path);
    }

    return {
      repoUrl: repo.html_url,
      defaultBranch: repo.default_branch,
      filesSynced: results.length,
      syncedAt: stamp,
      zipUrl: `https://codeload.github.com/${repo.full_name}/zip/refs/heads/${repo.default_branch}`,
    };
  });
