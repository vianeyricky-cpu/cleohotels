// Existing Supabase rows use both comma-separated strings and JSON arrays.
export function roomAmenities(value: unknown): string[] {
  const values = Array.isArray(value) ? value : typeof value === 'string' ? value.split(',') : [];
  return values.filter((item): item is string => typeof item === 'string').map(item => item.trim()).filter(Boolean);
}

// Legacy room records may already include their unit, such as "16 m²" or "2 Adults".
export function roomFact(value: unknown, unit: string): string {
  const text = String(value ?? '').trim();
  return /^\d+(?:[.,]\d+)?$/.test(text) ? `${text} ${unit}` : text;
}
