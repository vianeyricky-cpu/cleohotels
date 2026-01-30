"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";
import type {
  Facility,
  Hotel,
  HotelWithImages,
  HotelWithRelations,
  Room,
} from "@/types";

export async function getHotels(): Promise<Hotel[]> {
  const { data, error } = await supabase
    .from("Hotel")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Hotel[];
}

export async function getHotelBySlug(
  slug: string
): Promise<HotelWithRelations | null> {
  const { data, error } = await supabase
    .from("Hotel")
    .select("*, rooms:Room(*), facilities:Facility(*)")
    .eq("slug", slug)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(error.message);
  }

  return data as HotelWithRelations;
}

export async function updateHotelImages(id: string, images: string[]) {
  const { data, error } = await supabase
    .from("Hotel")
    .update({ images })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  return data as HotelWithImages;
}

export async function updateRoom(
  id: string,
  data: {
    name?: string;
    size?: string;
    capacity?: string;
    description?: string;
    amenities?: string[];
    image?: string;
  }
) {
  const { data: room, error } = await supabase
    .from("Room")
    .update(data)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  return room as Room;
}

export async function uploadImage(formData: FormData) {
  const file = formData.get("file");

  if (!(file instanceof File)) {
    throw new Error("File is required.");
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const extension = file.name.split(".").pop() ?? "jpg";
  const fileName = `${crypto.randomUUID()}.${extension}`;

  const { data, error } = await supabase.storage
    .from("cleo-assets")
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  const { data: publicUrlData } = supabase.storage
    .from("cleo-assets")
    .getPublicUrl(data.path);

  return { path: data.path, publicUrl: publicUrlData.publicUrl };
}

export async function updateHotel(
  id: string,
  data: {
    name?: string;
    tagline?: string;
    description?: string;
    address?: string;
    phone?: string;
    instagram?: string;
    slug?: string;
  }
) {
  const { data: hotel, error } = await supabase
    .from("Hotel")
    .update(data)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  return hotel as Hotel;
}

export async function createFacility(data: {
  name: string;
  type: string;
  description: string;
  image: string;
  hotelId: string;
}) {
  const { data: facility, error } = await supabase
    .from("Facility")
    .insert(data)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  return facility as Facility;
}

export async function updateFacility(
  id: string,
  data: {
    name?: string;
    type?: string;
    description?: string;
    image?: string;
  }
) {
  const { data: facility, error } = await supabase
    .from("Facility")
    .update(data)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  return facility as Facility;
}

export async function deleteFacility(id: string) {
  const { error } = await supabase.from("Facility").delete().eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
  revalidatePath("/");
}

export async function createRoom(data: {
  name: string;
  size: string;
  capacity: string;
  description: string;
  amenities: string[];
  image: string;
  hotelId: string;
}) {
  const { data: room, error } = await supabase
    .from("Room")
    .insert(data)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  return room as Room;
}

export async function deleteRoom(id: string) {
  const { error } = await supabase.from("Room").delete().eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
  revalidatePath("/");
}
