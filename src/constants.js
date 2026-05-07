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
  yellow: { border: "border border-yellow-300", lightBg: "bg-yellow-100/75", darkBg: "bg-yellow-950/60" },
  red:    { border: "border border-red-300",    lightBg: "bg-red-100/75",    darkBg: "bg-red-950/60"    },
  green:  { border: "border border-green-300",  lightBg: "bg-green-100/75",  darkBg: "bg-green-950/60"  },
  orange: { border: "border border-orange-300", lightBg: "bg-orange-100/75", darkBg: "bg-orange-950/60" },
  blue:   { border: "border border-blue-300",   lightBg: "bg-blue-100/75",   darkBg: "bg-blue-950/60"   },
  gray:   { border: "border border-gray-200",   lightBg: "bg-gray-50/75",    darkBg: "bg-zinc-800/70"   },
};
