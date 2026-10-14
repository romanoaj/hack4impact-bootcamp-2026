"use client";

import type { MovieType } from "@/database/movieSchema";
import { Menu } from "@base-ui/react/menu";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type Ticket = { storageKey: string; movie: MovieType; screening: string; seats: string[] };

export default function UpcomingTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    const bookings: { storageKey: string; movieId: string; screening: string; seats: string[] }[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key?.startsWith("seats:")) continue;
      const [, movieId, screening] = key.split(":");
      try {
        const { booked } = JSON.parse(localStorage.getItem(key) ?? "") as { booked?: string[] };
        if (movieId && screening && booked?.length) {
          bookings.push({ storageKey: key, movieId, screening: decodeURIComponent(screening), seats: booked });
        }
      } catch {}
    }
    if (bookings.length === 0) return;

    fetch("/api/movies")
      .then((res) => res.json())
      .then((movies: MovieType[]) => {
        if (!Array.isArray(movies)) return;
        setTickets(
          bookings.flatMap((b) => {
            const movie = movies.find((m) => String(m.id) === b.movieId);
            return movie ? [{ storageKey: b.storageKey, movie, screening: b.screening, seats: b.seats }] : [];
          }),
        );
      })
      .catch((error) => console.error("Failed to load tickets:", error));
  }, []);

  const cancelTickets = (storageKey: string) => {
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey) ?? "{}") as { taken?: string[] };
      localStorage.setItem(storageKey, JSON.stringify({ taken: stored.taken ?? [], booked: [] }));
    } catch {
      localStorage.removeItem(storageKey);
    }
    setTickets((prev) => prev.filter((t) => t.storageKey !== storageKey));
  };

  if (tickets.length === 0) return null;

  return (
    <section aria-label="Your tickets" className="pt-18 pl-[clamp(24px,7vw,112px)] sm:pl-0">
      <div className="max-w-md rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-5 text-stone-100">
        <p className="text-xs uppercase tracking-wide text-emerald-400">
          You have tickets to {tickets.length === 1 ? "a screening" : "screenings"} coming soon
        </p>
        <ul className="mt-3 flex flex-col divide-y divide-white/10">
          {tickets.map(({ storageKey, movie, screening, seats }) => (
            <li
              key={`${movie.id}:${screening}`}
              className="flex items-center justify-between gap-4 py-2 first:pt-0 last:pb-0"
            >
              <Link href={`/movies/${movie.id}`} className="block min-w-0">
                <p className="font-semibold">{movie.title}</p>
                <p className="text-sm text-stone-300">
                  {screening} · Seat{seats.length === 1 ? "" : "s"} {seats.join(", ")}
                </p>
              </Link>
              <Menu.Root>
                <Menu.Trigger
                  aria-label={`Options for ${movie.title} tickets`}
                  className="cursor-pointer rounded-full p-1.5 text-stone-300 transition-colors hover:bg-white/10 hover:text-stone-100"
                >
                  <MoreHorizontal className="size-5" />
                </Menu.Trigger>
                <Menu.Portal>
                  <Menu.Positioner align="end" sideOffset={4}>
                    <Menu.Popup className="rounded-lg border border-white/15 bg-neutral-900 p-1 text-sm text-stone-100 shadow-xl">
                      <Menu.Item
                        onClick={() => cancelTickets(storageKey)}
                        className="cursor-pointer rounded-md px-3 py-1.5 text-red-400 outline-none data-highlighted:bg-white/10"
                      >
                        Cancel tickets
                      </Menu.Item>
                    </Menu.Popup>
                  </Menu.Positioner>
                </Menu.Portal>
              </Menu.Root>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
