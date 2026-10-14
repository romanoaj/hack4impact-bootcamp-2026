"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";

type SeatSelectProps = {
  /** localStorage key under which taken and booked seats are persisted. */
  storageKey: string;
  rows?: number;
  seatsPerRow?: number;
  onChange?: (selected: string[]) => void;
  onConfirm?: (seats: string[]) => void;
};

const rowLabel = (row: number) => String.fromCharCode(65 + row);

type StoredSeats = { taken: string[]; booked: string[] };

function randomTakenSeats(rows: number, seatsPerRow: number) {
  const taken: string[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 1; c <= seatsPerRow; c++) {
      if (Math.random() < 0.3) taken.push(`${rowLabel(r)}${c}`);
    }
  }
  return taken;
}

// localStorage doesn't notify the writing tab, so keep our own subscribers.
const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => void listeners.delete(cb);
};
const writeSeats = (key: string, seats: StoredSeats) => {
  localStorage.setItem(key, JSON.stringify(seats));
  listeners.forEach((cb) => cb());
};
const EMPTY: StoredSeats = { taken: [], booked: [] };

export default function SeatSelect({ storageKey, rows = 8, seatsPerRow = 12, onChange, onConfirm }: SeatSelectProps) {
  // The server snapshot is null, so hydration matches; the client then reads localStorage.
  const raw = useSyncExternalStore(
    subscribe,
    () => localStorage.getItem(storageKey),
    () => null,
  );
  const loaded = raw !== null;
  const { taken, booked } = useMemo<StoredSeats>(() => {
    try {
      return raw ? (JSON.parse(raw) as StoredSeats) : EMPTY;
    } catch {
      return EMPTY;
    }
  }, [raw]);

  const [selected, setSelected] = useState<string[]>([]);

  // First visit: generate and persist the random taken seats.
  useEffect(() => {
    if (localStorage.getItem(storageKey) === null) {
      writeSeats(storageKey, { taken: randomTakenSeats(rows, seatsPerRow), booked: [] });
    }
  }, [storageKey, rows, seatsPerRow]);

  const [justBooked, setJustBooked] = useState<string[]>([]);

  const toggleSeat = (seat: string) => {
    const next = selected.includes(seat) ? selected.filter((s) => s !== seat) : [...selected, seat];
    setSelected(next);
    setJustBooked([]);
    onChange?.(next);
  };

  const confirmSeats = () => {
    onConfirm?.(selected);
    writeSeats(storageKey, { taken, booked: [...booked, ...selected] });
    setJustBooked(selected);
    setSelected([]);
    onChange?.([]);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="w-full max-w-xl">
        <div className="h-2 rounded-full bg-stone-700" />
        <p className="mt-2 text-center text-xs uppercase tracking-[0.3em] text-stone-500">Screen</p>
      </div>

      <div className="flex flex-col gap-2">
        {Array.from({ length: rows }, (_, r) => (
          <div key={r} className="flex items-center gap-2">
            <span className="w-4 text-xs text-stone-500">{rowLabel(r)}</span>
            {Array.from({ length: seatsPerRow }, (_, i) => {
              const seat = `${rowLabel(r)}${i + 1}`;
              const isBooked = booked.includes(seat);
              const isTaken = taken.includes(seat);
              const isUnavailable = !loaded || isTaken || isBooked;
              const isSelected = selected.includes(seat);
              const isAisle = i === Math.floor(seatsPerRow / 2) - 1;

              return (
                <button
                  key={seat}
                  type="button"
                  disabled={isUnavailable}
                  onClick={() => toggleSeat(seat)}
                  aria-label={`Seat ${seat}${isBooked ? ", your booking" : isTaken ? ", taken" : ""}`}
                  aria-pressed={isSelected}
                  className={`size-7 rounded-t-lg rounded-b-sm text-[0.6rem] transition-colors ${isAisle ? "mr-4" : ""} ${
                    isBooked
                      ? "cursor-not-allowed bg-emerald-500 text-neutral-950 font-semibold"
                      : isTaken
                        ? "cursor-not-allowed bg-stone-800 text-transparent"
                        : isSelected
                          ? "bg-yellow-400 text-neutral-950 font-semibold"
                          : "cursor-pointer bg-stone-600 text-transparent hover:bg-stone-400 hover:text-neutral-950"
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
            <span className="w-4 text-right text-xs text-stone-500">{rowLabel(r)}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-6 text-sm text-stone-400">
        <span className="flex items-center gap-2">
          <span className="size-4 rounded-t-md rounded-b-sm bg-stone-600" /> Available
        </span>
        <span className="flex items-center gap-2">
          <span className="size-4 rounded-t-md rounded-b-sm bg-yellow-400" /> Selected
        </span>
        <span className="flex items-center gap-2">
          <span className="size-4 rounded-t-md rounded-b-sm bg-emerald-500" /> Your seats
        </span>
        <span className="flex items-center gap-2">
          <span className="size-4 rounded-t-md rounded-b-sm bg-stone-800" /> Taken
        </span>
      </div>

      <p className="text-stone-300">
        {justBooked.length > 0
          ? `Booked seat${justBooked.length === 1 ? "" : "s"} ${justBooked.join(", ")}!`
          : selected.length === 0
            ? "No seats selected"
            : `${selected.length} seat${selected.length === 1 ? "" : "s"} selected: ${selected.join(", ")}`}
      </p>

      <button
        type="button"
        disabled={selected.length === 0}
        onClick={confirmSeats}
        className="cursor-pointer rounded-full bg-yellow-400 px-8 py-3 font-semibold text-neutral-950 transition-colors hover:bg-yellow-300 disabled:cursor-not-allowed disabled:bg-stone-800 disabled:text-stone-500"
      >
        Confirm seats
      </button>
    </div>
  );
}
