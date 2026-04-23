export function parseAppDate(value) {
  if (!value) return null;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === "number") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  if (typeof value !== "string") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const trimmed = value.trim();
  if (!trimmed) return null;

  const normalized = trimmed.includes("T")
    ? trimmed
    : trimmed.replace(" ", "T");

  const localDate = new Date(normalized);
  const hasTimezone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(normalized);

  if (hasTimezone) {
    return Number.isNaN(localDate.getTime()) ? null : localDate;
  }

  const utcDate = new Date(`${normalized}Z`);
  const localValid = !Number.isNaN(localDate.getTime());
  const utcValid = !Number.isNaN(utcDate.getTime());

  if (!localValid && !utcValid) return null;
  if (!localValid) return utcDate;
  if (!utcValid) return localDate;

  const now = Date.now();
  const localDiff = Math.abs(now - localDate.getTime());
  const utcDiff = Math.abs(now - utcDate.getTime());

  return utcDiff < localDiff ? utcDate : localDate;
}
