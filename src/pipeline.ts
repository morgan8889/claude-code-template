// Delivery Pipeline Proof — a small, data-driven surface that demonstrates the
// Lovelace automatic delivery pipeline: ticket traceability, the Claude ACP
// implementation lane, Codex governance review, Plane state, local gates,
// visual evidence, and PR handoff. The stages are data, the rendering is pure,
// so the page is fully covered by unit tests.

export type StageStatus = "done" | "active" | "pending";

export interface PipelineStage {
  /** Stable identifier used as a render key. */
  id: string;
  /** Human-readable stage name. */
  name: string;
  /** One-line description of what the stage proves. */
  detail: string;
  /** Where this stage currently sits in the delivery flow. */
  status: StageStatus;
}

export interface Ticket {
  id: string;
  title: string;
}

export interface PipelineSummary {
  done: number;
  active: number;
  pending: number;
  total: number;
  /** Share of stages marked done, 0–100, rounded to the nearest integer. */
  percentComplete: number;
}

/** The ticket this delivery proves traceability for. */
export const ticket: Ticket = {
  id: "OCR-4",
  title: "Lovelace pipeline proof",
};

/** The canonical stages of the Lovelace automatic delivery pipeline. */
export const pipelineStages: PipelineStage[] = [
  {
    id: "ticket",
    name: "Ticket traceability",
    detail: "OCR-4 mirrored in Plane and the feature branch name.",
    status: "done",
  },
  {
    id: "implement",
    name: "Claude ACP implementation lane",
    detail: "Change built through Claude ACP with Codex governance fixup.",
    status: "active",
  },
  {
    id: "governance",
    name: "Codex governance review",
    detail: "Independent review checks scope, truthfulness, and risk.",
    status: "pending",
  },
  {
    id: "plane",
    name: "Plane state sync",
    detail: "Work item transitions tracked as the system of record.",
    status: "pending",
  },
  {
    id: "gates",
    name: "Local validation gates",
    detail: "typecheck, lint, unit, and build run green before handoff.",
    status: "pending",
  },
  {
    id: "visual",
    name: "Visual evidence",
    detail: "Playwright captures a screenshot baseline for the page.",
    status: "pending",
  },
  {
    id: "handoff",
    name: "PR handoff",
    detail: "A PR-ready artifact opens for human review — no auto-merge.",
    status: "pending",
  },
];

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/** Escape text so it is safe to interpolate into HTML. */
export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char] ?? char);
}

/** Aggregate stage counts and overall completion. */
export function summarize(stages: PipelineStage[]): PipelineSummary {
  const done = stages.filter((stage) => stage.status === "done").length;
  const active = stages.filter((stage) => stage.status === "active").length;
  const pending = stages.filter((stage) => stage.status === "pending").length;
  const total = stages.length;
  const percentComplete = total === 0 ? 0 : Math.round((done / total) * 100);
  return { done, active, pending, total, percentComplete };
}

const STATUS_LABELS: Record<StageStatus, string> = {
  done: "Done",
  active: "Active",
  pending: "Pending",
};

/** Render a single stage as a list item. */
export function renderStage(stage: PipelineStage): string {
  return `<li class="stage" data-status="${stage.status}">
  <span class="stage-badge">${STATUS_LABELS[stage.status]}</span>
  <span class="stage-body">
    <span class="stage-name">${escapeHtml(stage.name)}</span>
    <span class="stage-detail">${escapeHtml(stage.detail)}</span>
  </span>
</li>`;
}

/** Render the full Delivery Pipeline Proof page body. */
export function renderPipeline(
  stages: PipelineStage[],
  context: Ticket,
): string {
  const summary = summarize(stages);
  const items = stages.map(renderStage).join("\n");
  return `<main class="pipeline">
  <header class="pipeline-header">
    <p class="pipeline-eyebrow">Lovelace · Automatic Delivery Pipeline</p>
    <h1 class="pipeline-title">Delivery Pipeline Proof</h1>
    <p class="pipeline-ticket">
      <span class="ticket-id">${escapeHtml(context.id)}</span>
      <span class="ticket-title">${escapeHtml(context.title)}</span>
    </p>
  </header>
  <p class="pipeline-summary">
    ${summary.done}/${summary.total} stages complete · ${summary.percentComplete}%
  </p>
  <ol class="pipeline-stages">
${items}
  </ol>
</main>`;
}
