import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { bootstrap } from "./main";
import { ticket } from "./pipeline";

describe("bootstrap", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "document",
      Object.create(null, {
        getElementById: {
          value: vi.fn(),
          writable: true,
        },
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders the pipeline proof into the #app element when present", () => {
    const el = { innerHTML: "" };
    (document.getElementById as ReturnType<typeof vi.fn>).mockReturnValue(el);

    bootstrap();

    expect(document.getElementById).toHaveBeenCalledWith("app");
    expect(el.innerHTML).toContain("Delivery Pipeline Proof");
    expect(el.innerHTML).toContain(ticket.id);
  });

  it("does nothing when #app element is missing", () => {
    (document.getElementById as ReturnType<typeof vi.fn>).mockReturnValue(null);

    expect(() => bootstrap()).not.toThrow();
  });
});
