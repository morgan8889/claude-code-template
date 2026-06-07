import { describe, expect, it } from "vitest";
import {
  type PipelineStage,
  escapeHtml,
  pipelineStages,
  renderPipeline,
  renderStage,
  summarize,
  ticket,
} from "./pipeline";

const sample: PipelineStage[] = [
  { id: "a", name: "Stage A", detail: "first", status: "done" },
  { id: "b", name: "Stage B", detail: "second", status: "active" },
  { id: "c", name: "Stage C", detail: "third", status: "pending" },
  { id: "d", name: "Stage D", detail: "fourth", status: "pending" },
];

describe("escapeHtml", () => {
  it("escapes HTML-significant characters", () => {
    expect(escapeHtml(`<a href="x">&'`)).toBe(
      "&lt;a href=&quot;x&quot;&gt;&amp;&#39;",
    );
  });

  it("leaves plain text untouched", () => {
    expect(escapeHtml("Ticket OCR-4")).toBe("Ticket OCR-4");
  });
});

describe("summarize", () => {
  it("counts stages by status", () => {
    const summary = summarize(sample);
    expect(summary.done).toBe(1);
    expect(summary.active).toBe(1);
    expect(summary.pending).toBe(2);
    expect(summary.total).toBe(4);
  });

  it("computes percent complete from done stages, rounded", () => {
    expect(summarize(sample).percentComplete).toBe(25);
  });

  it("reports 0 percent for an empty pipeline without dividing by zero", () => {
    const summary = summarize([]);
    expect(summary.total).toBe(0);
    expect(summary.percentComplete).toBe(0);
  });
});

describe("renderStage", () => {
  it("renders a list item carrying the status as a data attribute", () => {
    const html = renderStage(sample[1]);
    expect(html).toContain('data-status="active"');
    expect(html).toContain("Stage B");
    expect(html).toContain("second");
  });

  it("escapes stage content to prevent HTML injection", () => {
    const html = renderStage({
      id: "x",
      name: "<script>alert(1)</script>",
      detail: "a & b",
      status: "pending",
    });
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain("a &amp; b");
  });
});

describe("renderPipeline", () => {
  it("includes the ticket identifier and every stage name", () => {
    const html = renderPipeline(sample, ticket);
    expect(html).toContain(ticket.id);
    for (const stage of sample) {
      expect(html).toContain(stage.name);
    }
  });

  it("renders one list item per stage", () => {
    const html = renderPipeline(sample, ticket);
    const matches = html.match(/data-status=/g) ?? [];
    expect(matches).toHaveLength(sample.length);
  });

  it("surfaces the completion summary", () => {
    const html = renderPipeline(sample, ticket);
    expect(html).toContain("25%");
  });
});

describe("pipelineStages data", () => {
  it("defines the Lovelace delivery pipeline with unique stage ids", () => {
    expect(pipelineStages.length).toBeGreaterThanOrEqual(5);
    const ids = pipelineStages.map((stage) => stage.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("only uses known status values", () => {
    const allowed = new Set(["done", "active", "pending"]);
    for (const stage of pipelineStages) {
      expect(allowed.has(stage.status)).toBe(true);
    }
  });
});
