import { describe, expect, it } from "vitest";
import { getMovieById, movies } from "@/app/data/movies";
import { upcomingMovies } from "@/app/data/upcomingMovies";

describe.each([
  ["movies", movies],
  ["upcomingMovies", upcomingMovies],
])("%s data", (_name, list) => {
  it("is non-empty", () => {
    expect(list.length).toBeGreaterThan(0);
  });

  it("has unique ids", () => {
    const ids = list.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has required fields on every movie", () => {
    for (const m of list) {
      expect(m.title).toBeTruthy();
      expect(m.runtimeMinutes).toBeGreaterThan(0);
      expect(m.showtimes.length).toBeGreaterThan(0);
    }
  });
});

describe("getMovieById", () => {
  it("returns the matching movie", () => {
    const first = movies[0];
    expect(getMovieById(first.id)).toEqual(first);
  });

  it("returns undefined/null for an unknown id", () => {
    expect(getMovieById("does-not-exist") ?? null).toBeNull();
  });
});
