"use server";

import { supabase } from "@/lib/supabase";
import type { Facility, Hotel, HotelWithRelations, Room } from "@/types";
import { unstable_noStore as noStore } from "next/cache"; // <--- IMPORT INI

export async function getHotels(): Promise<Hotel[]> {
  noStore(); // <--- TAMBAHKAN INI (Agar data selalu fresh/baru)
  
  const { data, error } = await supabase
    .from("Hotel")
    .select("*")
    .order("id", { ascending: true }); // Tambahkan sort biar rapi

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Hotel[];
}

type HotelRelationsPayload = Hotel & {
  Room?: Room[];
  Facility?: Facility[];
};

export async function getHotelBySlug(
  slug: string
): Promise<HotelWithRelations | null> {
  noStore(); // <--- TAMBAHKAN INI JUGA

  const { data, error } = await supabase
    .from("Hotel")
    .select("*, Room(*), Facility(*)")
    .eq("slug", slug)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(error.message);
  }

  const payload = data as HotelRelationsPayload;
  return {
    ...payload,
    rooms: payload.Room ?? [],
    facilities: payload.Facility ?? [],
  };
}