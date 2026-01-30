import Link from "next/link";
import { getHotelBySlug } from "@/actions/getHotels";

export default async function HotelRoomsPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const hotel = await getHotelBySlug(params.slug);

  if (!hotel) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="text-2xl font-semibold text-navy-900">
          Hotel not found
        </h1>
      </div>
    );
  }

  return (
    <main className="bg-navy-950 text-white">
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-gold-400">
              Rooms & Suites
            </p>
            <h1 className="mt-3 text-3xl font-semibold">
              {hotel.name} Rooms
            </h1>
          </div>
          <Link
            href={`/hotels/${hotel.slug}`}
            className="text-xs uppercase tracking-[0.3em] text-white/70 hover:text-gold-400"
          >
            Back to hotel
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {hotel.rooms.map((room) => (
            <div
              key={room.id}
              className="rounded-2xl border border-navy-700/60 bg-navy-900/50 p-6"
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold">{room.name}</h3>
                <span className="text-xs uppercase text-gold-400">
                  {room.capacity}
                </span>
              </div>
              <p className="text-sm text-white/70">{room.description}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/70">
                {room.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="rounded-full border border-navy-700/60 px-3 py-1"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
