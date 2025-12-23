const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

export const darkenColor = (value: string, factor: number) => {
  const f = clamp01(factor);
  const hex = value.replace("#", "");

  // Supports #rgb and #rrggbb.
  const normalized =
    hex.length === 3
      ? hex
          .split("")
          .map(ch => ch + ch)
          .join("")
      : hex;

  if (normalized.length !== 6) {
    return value;
  }

  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);

  if (![r, g, b].every(Number.isFinite)) {
    return value;
  }

  const nr = Math.round(r * f);
  const ng = Math.round(g * f);
  const nb = Math.round(b * f);

  return `rgb(${nr}, ${ng}, ${nb})`;
};
