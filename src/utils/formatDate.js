const DATE_FMT = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function formatDateShort(isoString) {
  return DATE_FMT.format(new Date(isoString));
}

export function formatDateFull(isoString) {
  const date = new Date(isoString);
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");
  return `${DATE_FMT.format(date)} at ${h}:${m}`;
}
