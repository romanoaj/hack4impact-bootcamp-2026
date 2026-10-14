import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("joins class names", () => {
    expect(cn("a", "b")).toContain("a");
    expect(cn("a", "b")).toContain("b");
  });

  it("skips falsy values", () => {
    const result = cn("a", false, undefined, null);
    expect(result).toContain("a");
    expect(result).not.toContain("false");
    expect(result).not.toContain("undefined");
  });
});
