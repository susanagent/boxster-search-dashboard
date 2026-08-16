export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatMiles(value: number): string {
  return `${new Intl.NumberFormat("en-US").format(value)} mi`;
}

export function formatMileage(value: number): string {
  return `${new Intl.NumberFormat("en-US").format(value)} mi`;
}

export function formatDriveTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins} min`;
  return `${hours} hr ${mins} min`;
}

export function formatDate(iso: string): string {
  const date = parseDate(iso);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function daysSince(iso: string, now: Date = new Date()): number {
  const then = parseDate(iso);
  const diffMs = now.getTime() - then.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

function parseDate(iso: string): Date {
  // Date-only values are interpreted locally; full ISO timestamps already
  // contain their own time and offset and must not receive another suffix.
  return new Date(iso.includes("T") ? iso : `${iso}T00:00:00`);
}
