"use client";

import { useMemo, useTransition } from "react";
import type { Facility, Hotel } from "@/types";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createFacility,
  deleteFacility,
  updateFacility,
} from "@/actions";
import { ImageUpload } from "@/components/admin/ImageUpload";

const facilitySchema = z.object({
  name: z.string().min(2),
  type: z.string().min(2),
  description: z.string().min(10),
});

type FacilityFormValues = z.infer<typeof facilitySchema>;

export function FacilityManager({
  hotels,
  facilities,
}: {
  hotels: Hotel[];
  facilities: Facility[];
}) {
  const facilitiesByHotel = useMemo(() => {
    const grouped: Record<string, Facility[]> = {};
    facilities.forEach((facility) => {
      grouped[facility.hotelId] ??= [];
      grouped[facility.hotelId].push(facility);
    });
    return grouped;
  }, [facilities]);

  return (
    <div className="space-y-10">
      {hotels.map((hotel) => (
        <FacilitySection
          key={hotel.id}
          hotel={hotel}
          facilities={facilitiesByHotel[hotel.id] ?? []}
        />
      ))}
    </div>
  );
}

function FacilitySection({
  hotel,
  facilities,
}: {
  hotel: Hotel;
  facilities: Facility[];
}) {
  const [isPending, startTransition] = useTransition();
  const createForm = useForm<FacilityFormValues>({
    resolver: zodResolver(facilitySchema),
    defaultValues: {
      name: "",
      type: "",
      description: "",
    },
  });

  return (
    <section className="rounded-2xl border border-navy-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-navy-900">{hotel.name}</h3>
          <p className="text-xs text-navy-500">
            Facilities: {facilities.length}
          </p>
        </div>
        {isPending && <span className="text-xs text-navy-400">Saving...</span>}
      </div>

      <form
        className="mb-8 grid gap-4 md:grid-cols-2"
        onSubmit={createForm.handleSubmit((values) => {
          startTransition(async () => {
            await createFacility({
              hotelId: hotel.id,
              name: values.name,
              type: values.type,
              description: values.description,
              image: "",
            });
            createForm.reset();
          });
        })}
      >
        <InputField label="Facility name" {...createForm.register("name")} />
        <InputField label="Type" {...createForm.register("type")} />
        <div className="md:col-span-2">
          <label className="mb-1 block text-xs font-medium text-navy-700">
            Description
          </label>
          <textarea
            rows={3}
            className="w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
            {...createForm.register("description")}
          />
        </div>
        <div className="md:col-span-2">
          <button
            type="submit"
            className="rounded-lg bg-gold-400 px-4 py-2 text-sm font-medium text-navy-900 transition hover:bg-gold-300"
          >
            Add facility
          </button>
        </div>
      </form>

      <div className="space-y-6">
        {facilities.map((facility) => (
          <FacilityCard key={facility.id} facility={facility} />
        ))}
      </div>
    </section>
  );
}

function FacilityCard({ facility }: { facility: Facility }) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<FacilityFormValues>({
    resolver: zodResolver(facilitySchema),
    defaultValues: {
      name: facility.name,
      type: facility.type,
      description: facility.description,
    },
  });

  return (
    <div className="rounded-xl border border-navy-100 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-base font-semibold text-navy-900">
          {facility.name}
        </h4>
        <button
          type="button"
          onClick={() =>
            startTransition(async () => {
              await deleteFacility(facility.id);
            })
          }
          className="text-xs text-red-500 hover:text-red-400"
        >
          Delete
        </button>
      </div>
      <form
        className="grid gap-4 md:grid-cols-2"
        onSubmit={form.handleSubmit((values) => {
          startTransition(async () => {
            await updateFacility(facility.id, values);
          });
        })}
      >
        <InputField label="Facility name" {...form.register("name")} />
        <InputField label="Type" {...form.register("type")} />
        <div className="md:col-span-2">
          <label className="mb-1 block text-xs font-medium text-navy-700">
            Description
          </label>
          <textarea
            rows={3}
            className="w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
            {...form.register("description")}
          />
        </div>
        <div className="md:col-span-2">
          <button
            type="submit"
            className="rounded-lg bg-navy-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-navy-800"
          >
            Update facility
          </button>
        </div>
      </form>
      <div className="mt-6">
        <ImageUpload
          label="Upload facility image"
          onUploaded={(url) => {
            startTransition(async () => {
              await updateFacility(facility.id, { image: url });
            });
          }}
        />
      </div>
      {isPending && <p className="mt-2 text-xs text-navy-400">Saving...</p>}
    </div>
  );
}

function InputField({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-navy-700">
        {label}
      </label>
      <input
        className="w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
        {...props}
      />
    </div>
  );
}
