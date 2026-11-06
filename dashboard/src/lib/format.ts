// Small helpers to format numbers and labels

/** 12,345 */
export const int = (v: number | null | undefined) =>
  v == null || !Number.isFinite(v) ? '–' : Math.round(v).toLocaleString('en');

/** 12K, 3.4M (for axes and big numbers) */
export const compact = (v: number) => v.toLocaleString('en', { notation: 'compact', maximumFractionDigits: 1 });

/** 12.3% */
export const percent = (v: number) => `${v.toLocaleString('en', { maximumFractionDigits: 1 })}%`;

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
