import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { bootstrap, greet } from "./main";

describe("greet", () => {
  it("returns a greeting with the given name", () => {
    expect(greet("World")).toBe("Hello, World!");
  });

  it("handles empty string", () => {
    expect(greet("")).toBe("Hello, !");
  });
});

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

  it("sets textContent on #app element when present", () => {
    const el = { textContent: "" };
    (document.getElementById as ReturnType<typeof vi.fn>).mockReturnValue(el);

    bootstrap();

    expect(document.getElementById).toHaveBeenCalledWith("app");
    expect(el.textContent).toBe("Hello, World!");
  });

  it("does nothing when #app element is missing", () => {
    (document.getElementById as ReturnType<typeof vi.fn>).mockReturnValue(null);

    expect(() => bootstrap()).not.toThrow();
  });
});
