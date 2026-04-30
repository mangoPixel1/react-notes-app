export const NOTE_STATUS = {
  ACTIVE: "active",
  ARCHIVED: "archived",
  TRASHED: "trashed",
};

export const NOTE_COLORS = ["yellow", "red", "green", "orange", "blue", "gray"];

export const COLOR_SORT_ORDER = {
  red: 0,
  orange: 1,
  yellow: 2,
  green: 3,
  blue: 4,
  gray: 5,
};

export const ADD_NOTE_PATHS = ["/dashboard", "/folders"];

// border and background classes keyed by note color. Components apply structural classes (padding, margin) separately.
export const NOTE_COLOR_CLASSES = {
  yellow: { border: "border-2 border-yellow-400", lightBg: "bg-yellow-100", darkBg: "bg-zinc-700" },
  red:    { border: "border-2 border-red-400",    lightBg: "bg-red-100",    darkBg: "bg-zinc-700" },
  green:  { border: "border-2 border-green-400",  lightBg: "bg-green-100",  darkBg: "bg-zinc-700" },
  orange: { border: "border-2 border-orange-400", lightBg: "bg-orange-100", darkBg: "bg-zinc-700" },
  blue:   { border: "border-2 border-blue-400",   lightBg: "bg-blue-100",   darkBg: "bg-zinc-700" },
  gray:   { border: "border-2 border-gray-400",   lightBg: "bg-gray-100",   darkBg: "bg-zinc-700" },
};
