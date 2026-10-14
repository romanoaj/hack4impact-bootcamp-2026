import { beforeEach, describe, expect, it, vi } from "vitest";

const { connectDB, movieFind, menuFind, upcomingFind } = vi.hoisted(() => ({
  connectDB: vi.fn(),
  movieFind: vi.fn(),
  menuFind: vi.fn(),
  upcomingFind: vi.fn(),
}));

vi.mock("@/database/db", () => ({ default: connectDB }));
vi.mock("@/database/movieSchema", () => ({
  default: { find: movieFind },
  UpcomingMovie: { find: upcomingFind },
}));
vi.mock("@/database/menuItemSchema", () => ({ default: { find: menuFind } }));

import { GET as getConcessions } from "@/app/api/concessions/route";
import { GET as getMovies } from "@/app/api/movies/route";
import { GET as getUpcoming } from "@/app/api/upcoming/route";

const routes = [
  ["movies", getMovies, movieFind, "Failed to fetch movies"],
  ["concessions", getConcessions, menuFind, "Failed to fetch menu items"],
  ["upcoming", getUpcoming, upcomingFind, "Failed to fetch upcoming movies"],
] as const;

describe.each(routes)("GET /api/%s", (_name, GET, find, errorMessage) => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("returns the documents as JSON", async () => {
    const docs = [{ id: "1" }, { id: "2" }];
    find.mockResolvedValue(docs);

    const res = await GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(docs);
    expect(connectDB).toHaveBeenCalledOnce();
  });

  it("returns 500 when the database fails", async () => {
    find.mockRejectedValue(new Error("boom"));

    const res = await GET();
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: errorMessage });
  });
});
