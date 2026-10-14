import { getMovieById } from "@/app/data/movies";
import SeatSelect from "@/components/SeatSelect";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type MoviePageProps = {
  params: Promise<{ id: string; screening: string }>;
};

const ROWS = 8;
const SEATS_PER_ROW = 12;

function randomTakenSeats() {
  const taken: string[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 1; c <= SEATS_PER_ROW; c++) {
      if (Math.random() < 0.3) taken.push(`${String.fromCharCode(65 + r)}${c}`);
    }
  }
  return taken;
}

export async function generateMetadata({ params }: MoviePageProps): Promise<Metadata> {
  const { id, screening } = await params;
  const movie = getMovieById(id);

  return movie
    ? { title: `${decodeURIComponent(screening)} ${movie.title} | Movies`, description: movie.description }
    : { title: "Movie not found" };
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id, screening } = await params;

  const movie = getMovieById(id);
  if (!movie) notFound();

  return (
    <main className="min-h-screen pt-12 pb-22 px-[clamp(24px,7vw,112px)] text-stone-100 bg-neutral-950 bg-radial-[circle_at_80%_5%] from-yellow-800/16 to-transparent to-34%">
      <Link className="block text-sm text-stone-400 mb-12" href={`/movies/${movie.id}`}>
        ← {movie.title}
      </Link>

      <article className="grid gap-4 grid-cols-[minmax(240px,0.8fr)_minmax(360px,1.2fr)]">
        <div
          className="font-georgia relative flex flex-col justify-between min-h-162.5 p-8 overflow-hidden border border-white/15 rounded-3xl shadow-2xl after:absolute after:inset-0 after:content-[''] after:bg-linear-to-b after:from-transparent after:from-25% after:to-black/70"
          style={{ background: movie.posterGradient }}
        >
          <span className="text-white/55 text-[clamp(6rem,13vw,12rem)] leading-[0.8]">{movie.posterLabel}</span>
          <span className="z-1 max-w-sm text-white text-[clamp(2.5rem,5vw,4.6rem)] font-medium tracking-[-0.045em] leading-[0.94]">
            {movie.title}
          </span>
        </div>

        <div className="p-16">
          <div className="font-georgia font-medium text-3xl">
            <h1>Select seats for {decodeURIComponent(screening)}</h1>
          </div>

          <div className="mt-12">
            <SeatSelect takenSeats={randomTakenSeats()} rows={ROWS} seatsPerRow={SEATS_PER_ROW} />
          </div>
        </div>
      </article>
    </main>
  );
}
