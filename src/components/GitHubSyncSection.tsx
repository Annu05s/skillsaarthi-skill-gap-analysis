import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  CheckCircle2,
  Download,
  Github,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { getGitHubStatus, syncToGitHub } from "@/lib/github.functions";

export function GitHubSyncSection() {
  const fetchStatus = useServerFn(getGitHubStatus);
  const runSync = useServerFn(syncToGitHub);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const status = useQuery({
    queryKey: ["github-status"],
    queryFn: () => fetchStatus(),
    retry: false,
  });

  const sync = useMutation({
    mutationFn: () => runSync({ data: {} }),
    onSuccess: (result) => {
      setSyncMessage(
        `Synced ${result.filesSynced} files to GitHub at ${new Date(result.syncedAt).toLocaleTimeString()}.`,
      );
      status.refetch();
    },
    onError: (err) => {
      setSyncMessage(err instanceof Error ? err.message : "Sync failed.");
    },
  });

  const zipUrl = sync.data?.zipUrl ?? status.data?.zipUrl ?? null;
  const repoUrl = sync.data?.repoUrl ?? status.data?.repoUrl ?? null;

  return (
    <section
      aria-labelledby="github-sync-heading"
      className="rounded-lg border border-border bg-card p-6 shadow-sm"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Github className="size-5" aria-hidden />
          </span>
          <div>
            <h2
              id="github-sync-heading"
              className="text-lg font-bold tracking-tight text-foreground"
            >
              Code Sync &amp; Export
            </h2>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              {status.data
                ? `Connected as ${status.data.login}. One click pushes the latest source code to the “${status.data.repoName}” repository on GitHub.`
                : status.isError
                  ? "Could not reach GitHub. Check that the GitHub connection is linked to this project."
                  : "Checking your GitHub connection…"}
            </p>
            {syncMessage && (
              <p
                className="mt-2 flex items-center gap-1.5 text-sm font-medium text-accent"
                role="status"
              >
                <CheckCircle2 className="size-4" aria-hidden />
                {syncMessage}
              </p>
            )}
            {repoUrl && (
              <a
                href={repoUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                Open repository on GitHub
              </a>
            )}
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:items-end">
          <button
            type="button"
            onClick={() => sync.mutate()}
            disabled={sync.isPending}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {sync.isPending ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <RefreshCw className="size-4" aria-hidden />
            )}
            {sync.isPending ? "Syncing…" : "Sync to GitHub"}
          </button>
          {zipUrl ? (
            <a
              href={zipUrl}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-muted"
            >
              <Download className="size-4" aria-hidden />
              Download latest ZIP
            </a>
          ) : (
            <p className="text-xs text-muted-foreground">
              ZIP download appears after your first sync.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
