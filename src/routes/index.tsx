import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  FlaskConical,
  GraduationCap,
  Landmark,
  Layers,
  MoveRight,
  PlayCircle,
  Route as RouteIcon,
  Target,
  TrendingUp,
  UserRound,
} from "lucide-react";
import { skillGapAnalysisData as data } from "@/data/skillGap";
import type { CompetencyGap } from "@/data/skillGap";
import { GitHubSyncSection } from "@/components/GitHubSyncSection";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Skill Gap Analysis — SkillSaarthi | Karmayogi" },
      {
        name: "description",
        content:
          "Understand the competencies that need improvement for your current role. Compare your Skill Twin against role requirements and get prioritized learning recommendations.",
      },
      { property: "og:title", content: "Skill Gap Analysis — SkillSaarthi" },
      {
        property: "og:description",
        content:
          "Compare your Skill Twin against role competency requirements and discover your priority skill gaps.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SkillGapAnalysisPage,
});

/* ------------------------------- Top Navbar ------------------------------ */

function TopNavbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      {/* National strip */}
      <div className="bg-primary">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-1.5">
          <p className="flex items-center gap-1.5 text-[11px] font-medium text-primary-foreground">
            <Landmark className="size-3" aria-hidden />
            Capacity Building Commission · Karmayogi Bharat
          </p>
          <p className="hidden text-[11px] text-primary-foreground/70 sm:block">
            National Programme for Civil Services Capacity Building
          </p>
        </div>
      </div>
      {/* Portal bar */}
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a href="/" className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GraduationCap className="size-5" aria-hidden />
          </span>
          <span className="leading-tight">
            <span className="block text-base font-bold tracking-tight text-foreground">
              SkillSaarthi
            </span>
            <span className="block text-[11px] font-medium text-muted-foreground">
              Karmayogi Competency Platform
            </span>
          </span>
        </a>
        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          <a href="#" className="transition-colors hover:text-foreground">Dashboard</a>
          <a href="#" className="transition-colors hover:text-foreground">My Roles</a>
          <a href="#" className="text-teal" aria-current="page">Skill Gap</a>
          <a href="#" className="transition-colors hover:text-foreground">Learning</a>
        </nav>
        <div className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground">
          <UserRound className="size-4 text-muted-foreground" aria-hidden />
          <span className="hidden sm:inline">Officer Profile</span>
        </div>
      </div>
    </header>
  );
}

/* ----------------------------- Page header ------------------------------- */

function PageHeader() {
  return (
    <div className="border-b border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <nav className="mb-3 flex items-center gap-1 text-xs text-muted-foreground" aria-label="Breadcrumb">
          <span>Home</span>
          <ChevronRight className="size-3" aria-hidden />
          <span>My Roles</span>
          <ChevronRight className="size-3" aria-hidden />
          <span className="font-medium text-foreground">Skill Gap Analysis</span>
        </nav>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {data.pageTitle}
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
          {data.pageSubtitle}
        </p>
      </div>
    </div>
  );
}

/* ---------------------------- Role context ------------------------------- */

function RoleContextSection() {
  const { roleContext } = data;
  return (
    <section aria-labelledby="role-context" className="rounded-lg border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Current Role
          </p>
          <h2 id="role-context" className="mt-1 text-xl font-bold text-foreground">
            {roleContext.roleTitle}
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {roleContext.readinessNote}
          </p>
        </div>
        <div className="w-full shrink-0 sm:w-64">
          <div className="mb-2 flex items-end justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Overall Role Readiness
            </span>
            <span className="text-2xl font-bold text-teal">
              {roleContext.overallReadinessPercent}%
            </span>
          </div>
          <div
            className="h-2.5 w-full overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuenow={roleContext.overallReadinessPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Overall role readiness"
          >
            <div
              className="h-full rounded-full bg-teal transition-all"
              style={{ width: `${roleContext.overallReadinessPercent}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------ Competency gaps table -------------------------- */

function GapBar({ gap }: { gap: CompetencyGap }) {
  return (
    <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
      {/* Required level track */}
      <div
        className={cn(
          "absolute inset-y-0 left-0 rounded-full",
          gap.status === "meets" ? "bg-teal/30" : "bg-primary/15"
        )}
        style={{ width: `${gap.requiredPercent}%` }}
      />
      {/* Current level */}
      <div
        className={cn(
          "absolute inset-y-0 left-0 rounded-full",
          gap.isLargestGap
            ? "bg-destructive/80"
            : gap.status === "meets"
              ? "bg-teal"
              : "bg-primary"
        )}
        style={{ width: `${gap.currentPercent}%` }}
      />
    </div>
  );
}

function CompetencyGapsSection() {
  return (
    <section aria-labelledby="competency-gaps" className="rounded-lg border border-border bg-card shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4 sm:px-6">
        <h2 id="competency-gaps" className="flex items-center gap-2 text-base font-bold text-foreground">
          <BarChart3 className="size-4 text-teal" aria-hidden />
          Your Competency Gaps
        </h2>
        <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-4 rounded-full bg-primary" aria-hidden /> Current level
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-4 rounded-full bg-primary/15 ring-1 ring-inset ring-primary/30" aria-hidden /> Required level
          </span>
        </div>
      </div>

      {/* Table header (desktop) */}
      <div className="hidden grid-cols-12 gap-4 border-b border-border bg-muted/40 px-6 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground md:grid">
        <span className="col-span-3">Competency</span>
        <span className="col-span-1 text-right">Current</span>
        <span className="col-span-1 text-right">Required</span>
        <span className="col-span-5">Comparison</span>
        <span className="col-span-2 text-right">Gap</span>
      </div>

      <ul className="divide-y divide-border">
        {data.competencyGaps.map((gap) => (
          <li
            key={gap.id}
            className={cn(
              "px-5 py-4 sm:px-6",
              gap.isLargestGap && "bg-destructive/5"
            )}
          >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:items-center md:gap-4">
              <div className="md:col-span-3">
                <span className="text-sm font-semibold text-foreground">
                  {gap.skillName}
                </span>
                {gap.isLargestGap && (
                  <span className="ml-2 inline-flex items-center gap-1 rounded-sm bg-destructive/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-destructive">
                    <AlertTriangle className="size-2.5" aria-hidden />
                    Largest gap
                  </span>
                )}
              </div>
              <span className="text-sm tabular-nums text-muted-foreground md:col-span-1 md:text-right">
                <span className="mr-1 text-[11px] uppercase md:hidden">Current:</span>
                <span className="font-semibold text-foreground">{gap.currentPercent}%</span>
              </span>
              <span className="text-sm tabular-nums text-muted-foreground md:col-span-1 md:text-right">
                <span className="mr-1 text-[11px] uppercase md:hidden">Required:</span>
                {gap.requiredPercent}%
              </span>
              <div className="md:col-span-5">
                <GapBar gap={gap} />
              </div>
              <div className="md:col-span-2 md:text-right">
                {gap.status === "meets" ? (
                  <span className="inline-flex items-center gap-1 rounded-sm bg-teal/10 px-2 py-1 text-[11px] font-semibold text-teal">
                    <CheckCircle2 className="size-3" aria-hidden />
                    Meets requirement
                  </span>
                ) : (
                  <span
                    className={cn(
                      "inline-flex items-center rounded-sm px-2 py-1 text-[11px] font-semibold tabular-nums",
                      gap.isLargestGap
                        ? "bg-destructive/10 text-destructive"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    Gap: {gap.gapPoints} {gap.gapPoints === 1 ? "point" : "points"}
                  </span>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ------------------------ Priority gap + impact -------------------------- */

function PriorityGapSection() {
  const { priorityGap, gapImpact } = data;
  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Priority gap card */}
      <section
        aria-labelledby="priority-gap"
        className="rounded-lg border border-destructive/30 bg-card p-5 shadow-sm sm:p-6 lg:col-span-3"
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-sm bg-destructive px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-destructive-foreground">
            {priorityGap.priorityTag}
          </span>
          <span className="text-xs font-medium text-muted-foreground">
            Priority Skill Gap
          </span>
        </div>
        <h2 id="priority-gap" className="mt-3 text-xl font-bold text-foreground">
          {priorityGap.skillName}
        </h2>
        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <span className="tabular-nums text-muted-foreground">
            Current: <span className="font-bold text-destructive">{priorityGap.currentPercent}%</span>
          </span>
          <span className="tabular-nums text-muted-foreground">
            Required: <span className="font-bold text-foreground">{priorityGap.requiredPercent}%</span>
          </span>
          <span className="tabular-nums text-muted-foreground">
            Gap: <span className="font-bold text-destructive">{priorityGap.gapPoints} points</span>
          </span>
        </div>
        <div className="relative mt-3 h-3 w-full overflow-hidden rounded-full bg-muted">
          <div className="absolute inset-y-0 left-0 rounded-full bg-primary/15" style={{ width: `${priorityGap.requiredPercent}%` }} />
          <div className="absolute inset-y-0 left-0 rounded-full bg-destructive/80" style={{ width: `${priorityGap.currentPercent}%` }} />
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          {priorityGap.explanation}
        </p>
      </section>

      {/* Why this gap matters */}
      <section
        aria-labelledby="gap-impact"
        className="rounded-lg border border-border bg-card p-5 shadow-sm sm:p-6 lg:col-span-2"
      >
        <h2 id="gap-impact" className="flex items-center gap-2 text-base font-bold text-foreground">
          <Target className="size-4 text-teal" aria-hidden />
          Why this gap matters
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {gapImpact.summary}
        </p>
        <ul className="mt-4 space-y-2.5">
          {gapImpact.areas.map((area) => (
            <li key={area} className="flex items-start gap-2 text-sm text-foreground">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-teal" aria-hidden />
              {area}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

/* ------------------------- Recommended next step ------------------------- */

function RecommendedCourseSection() {
  const { recommendedCourse: course } = data;
  return (
    <section
      aria-labelledby="recommended-course"
      className="rounded-lg border border-teal/40 bg-accent/50 p-5 shadow-sm sm:p-6"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-teal">
        Recommended Next Step
      </p>
      <div className="mt-3 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-teal text-teal-foreground">
            <BookOpen className="size-5" aria-hidden />
          </span>
          <div>
            <h2 id="recommended-course" className="text-lg font-bold text-foreground">
              {course.title}
            </h2>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Layers className="size-3.5" aria-hidden />
                Provider: <span className="font-semibold text-foreground">{course.provider}</span>
              </span>
              <span className="flex items-center gap-1">
                <TrendingUp className="size-3.5" aria-hidden />
                Level: <span className="font-semibold text-foreground">{course.level}</span>
              </span>
              <span className="flex items-center gap-1">
                <Clock className="size-3.5" aria-hidden />
                Duration: <span className="font-semibold text-foreground">{course.durationHours} hrs</span>
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            <PlayCircle className="size-4" aria-hidden />
            Start Learning
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            <RouteIcon className="size-4" aria-hidden />
            View Learning Path
          </button>
        </div>
      </div>
    </section>
  );
}

/* ------------------------ Prioritization flow ---------------------------- */

function PrioritizationFlowSection() {
  const factors = data.prioritizationFactors;
  return (
    <section
      aria-labelledby="prioritization-flow"
      className="rounded-lg border border-border bg-card p-5 shadow-sm sm:p-6"
    >
      <h2 id="prioritization-flow" className="text-base font-bold text-foreground">
        How your learning priority is determined
      </h2>
      <div className="mt-5 flex flex-col items-stretch gap-2 md:flex-row md:items-center">
        {factors.map((factor, i) => {
          const isResult = i === factors.length - 1;
          const separator = isResult ? "=" : "+";
          return (
            <div key={factor.label} className="flex flex-1 flex-col items-stretch gap-2 md:flex-row md:items-center">
              {i > 0 && (
                <span
                  className={cn(
                    "self-center text-lg font-bold",
                    separator === "=" ? "text-teal" : "text-muted-foreground"
                  )}
                  aria-hidden
                >
                  {separator}
                </span>
              )}
              <div
                className={cn(
                  "flex-1 rounded-md border px-3 py-3 text-center",
                  isResult
                    ? "border-teal/50 bg-teal text-teal-foreground"
                    : "border-border bg-muted/40"
                )}
              >
                <p className={cn("text-sm font-bold", isResult ? "text-teal-foreground" : "text-foreground")}>
                  {factor.label}
                </p>
                <p className={cn("mt-0.5 text-[11px]", isResult ? "text-teal-foreground/85" : "text-muted-foreground")}>
                  {factor.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* --------------------------- What-If simulator --------------------------- */

function WhatIfSimulatorSection() {
  const { whatIfSimulator } = data;
  return (
    <section
      aria-labelledby="what-if"
      className="rounded-lg border border-border bg-primary p-5 shadow-sm sm:p-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-primary-foreground/10 text-teal">
            <FlaskConical className="size-5" aria-hidden />
          </span>
          <div>
            <h2 id="what-if" className="text-lg font-bold text-primary-foreground">
              {whatIfSimulator.heading}
            </h2>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-primary-foreground/75">
              {whatIfSimulator.description}
            </p>
          </div>
        </div>
        <button
          type="button"
          className="inline-flex shrink-0 items-center gap-2 rounded-md bg-teal px-4 py-2.5 text-sm font-semibold text-teal-foreground shadow-sm transition-colors hover:bg-teal/90"
        >
          Try What-If Simulator
          <ArrowRight className="size-4" aria-hidden />
        </button>
      </div>
      <p className="mt-3 text-[11px] text-primary-foreground/50">
        {whatIfSimulator.disclaimer}
      </p>
    </section>
  );
}

/* --------------------------- Bottom process flow ------------------------- */

function ProcessFlowSection() {
  return (
    <nav aria-label="Skill development process" className="rounded-lg border border-border bg-card p-5 shadow-sm sm:p-6">
      <ol className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-0">
        {data.processSteps.map((step, i) => (
          <li key={step.id} className="flex flex-1 items-center">
            <div className="flex items-center gap-2.5">
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold",
                  step.isCurrent
                    ? "border-teal bg-teal text-teal-foreground"
                    : "border-border bg-muted text-muted-foreground"
                )}
                aria-hidden
              >
                {i + 1}
              </span>
              <span
                className={cn(
                  "text-xs font-semibold sm:text-sm",
                  step.isCurrent ? "text-teal" : "text-muted-foreground"
                )}
                aria-current={step.isCurrent ? "step" : undefined}
              >
                {step.label}
              </span>
            </div>
            {i < data.processSteps.length - 1 && (
              <MoveRight className="mx-2 hidden size-4 shrink-0 text-border sm:block" aria-hidden />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* -------------------------------- Footer --------------------------------- */

function Footer() {
  return (
    <footer className="mt-12 border-t border-border bg-card">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>SkillSaarthi · Karmayogi Competency Platform</p>
        <p>Mission Karmayogi — National Programme for Civil Services Capacity Building</p>
      </div>
    </footer>
  );
}

/* --------------------------------- Page ---------------------------------- */

function SkillGapAnalysisPage() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <TopNavbar />
      <PageHeader />
      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        <RoleContextSection />
        <GitHubSyncSection />
        <CompetencyGapsSection />
        <PriorityGapSection />
        <RecommendedCourseSection />
        <PrioritizationFlowSection />
        <WhatIfSimulatorSection />
        <ProcessFlowSection />
      </main>
      <Footer />
    </div>
  );
}
