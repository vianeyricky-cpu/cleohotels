// Existing Supabase rows use both comma-separated strings and JSON arrays.
export function roomAmenities(value: unknown): string[] {
  const values = Array.isArray(value) ? value : typeof value === 'string' ? value.split(',') : [];
  return values.filter((item): item is string => typeof item === 'string').map(item => item.trim()).filter(Boolean);
}
