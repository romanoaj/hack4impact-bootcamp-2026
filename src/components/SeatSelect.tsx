"use client";

import { useMemo, useState } from "react";

type SeatSelectProps = {
  /** Seat IDs (e.g. "C5") that are already taken. */
  takenSeats: string[];
  rows?: number;
  seatsPerRow?: number;
  onChange?: (selected: string[]) => void;
  onConfirm?: (seats: string[]) => void;
};

const rowLabel = (row: number) => String.fromCharCode(65 + row);

export default function SeatSelect({ takenSeats, rows = 8, seatsPerRow = 12, onChange, onConfirm }: SeatSelectProps) {
  const taken = useMemo(() => new Set(takenSeats), [takenSeats]);

  const [selected, setSelected] = useState<string[]>([]);
  const [booked, setBooked] = useState<string[]>([]);
  const [justBooked, setJustBooked] = useState<string[]>([]);

  const toggleSeat = (seat: string) => {
    const next = selected.includes(seat) ? selected.filter((s) => s !== seat) : [...selected, seat];
    setSelected(next);
    setJustBooked([]);
    onChange?.(next);
  };

  const confirmSeats = () => {
    onConfirm?.(selected);
    setBooked([...booked, ...selected]);
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
              const isTaken = taken.has(seat) || booked.includes(seat);
              const isSelected = selected.includes(seat);
              const isAisle = i === Math.floor(seatsPerRow / 2) - 1;

              return (
                <button
                  key={seat}
                  type="button"
                  disabled={isTaken}
                  onClick={() => toggleSeat(seat)}
                  aria-label={`Seat ${seat}${isTaken ? ", taken" : ""}`}
                  aria-pressed={isSelected}
                  className={`size-7 rounded-t-lg rounded-b-sm text-[0.6rem] transition-colors ${isAisle ? "mr-4" : ""} ${
                    isTaken
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
