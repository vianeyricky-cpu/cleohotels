import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export default async function PromosPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: promos } = await supabase.from("promos").select("*").order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-neutral-50 pt-[120px] pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-neutral-900 mb-4">Offers & Packages</h1>
        <p className="text-lg text-neutral-600 mb-12 max-w-2xl">
          Take advantage of our large variety of packages and special offers created by us and designed with your needs in mind.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {promos?.map((promo) => (
            <div key={promo.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-neutral-200 flex flex-col">
              <div className="relative h-64 w-full">
                <Image src={promo.image_url || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80"} alt={promo.title} fill className="object-cover" />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-neutral-900 mb-2">{promo.title}</h3>
                <p className="text-neutral-600 text-sm mb-6 flex-1 leading-relaxed">{promo.description}</p>
                <div>
                  <Link href={promo.action_link || "#"} className="inline-flex items-center justify-center px-6 py-2.5 border border-neutral-300 rounded-full text-sm font-bold text-neutral-700 hover:bg-neutral-50 transition uppercase tracking-wider">
                    {promo.action_text || "SEE MORE"} →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}