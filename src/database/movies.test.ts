import { beforeEach, describe, expect, it, vi } from "vitest";

const { connectDB, findOne, lean } = vi.hoisted(() => ({
  connectDB: vi.fn(),
  findOne: vi.fn(),
  lean: vi.fn(),
}));

vi.mock("@/database/db", () => ({ default: connectDB }));
vi.mock("@/database/movieSchema", () => ({ default: { findOne } }));

import { getMovieById } from "@/database/movies";

describe("getMovieById (db)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    findOne.mockReturnValue({ lean });
  });

  it("connects, queries by id, and returns the movie", async () => {
    const movie = { id: "abc", title: "ABC" };
    lean.mockResolvedValue(movie);

    await expect(getMovieById("abc")).resolves.toBe(movie);
    expect(connectDB).toHaveBeenCalledOnce();
    expect(findOne).toHaveBeenCalledWith({ id: "abc" });
  });

  it("returns null when not found", async () => {
    lean.mockResolvedValue(null);
    await expect(getMovieById("nope")).resolves.toBeNull();
  });
});
