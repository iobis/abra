// Sequential single-hue blue ramp, light -> dark (dataviz skill palette,
// steps 100-700). Values are mapped through log1p before interpolating —
// OBIS-scale counts are power-law distributed, so a linear scale makes
// everything look empty except one or two hotspots.
export const RAMP = [
	'#cde2fb',
	'#b7d3f6',
	'#9ec5f4',
	'#86b6ef',
	'#6da7ec',
	'#5598e7',
	'#3987e5',
	'#2a78d6',
	'#256abf',
	'#1c5cab',
	'#184f95',
	'#104281',
	'#0d366b'
] as const;

const RAMP_RGB = RAMP.map((hex) => [
	parseInt(hex.slice(1, 3), 16),
	parseInt(hex.slice(3, 5), 16),
	parseInt(hex.slice(5, 7), 16)
]);

/** Interpolate the ramp at t in [0, 1], returning [r, g, b]. */
export function rampColor(t: number): [number, number, number] {
	t = Math.max(0, Math.min(1, t));
	const n = RAMP_RGB.length - 1;
	const pos = t * n;
	const i = Math.min(n - 1, Math.floor(pos));
	const f = pos - i;
	const a = RAMP_RGB[i];
	const b = RAMP_RGB[i + 1];
	return [
		Math.round(a[0] + (b[0] - a[0]) * f),
		Math.round(a[1] + (b[1] - a[1]) * f),
		Math.round(a[2] + (b[2] - a[2]) * f)
	];
}

/** A log1p-scaled [0,1] normalizer for a given [min, max] domain. */
export function logNormalizer(min: number, max: number) {
	const logMin = Math.log1p(Math.max(min, 0));
	const span = Math.max(Math.log1p(Math.max(max, 0)) - logMin, 1e-9);
	return (value: number) => (Math.log1p(Math.max(value, 0)) - logMin) / span;
}

export function formatCount(n: number): string {
	if (n >= 1e6) return (n / 1e6).toFixed(n >= 1e7 ? 0 : 1) + 'M';
	if (n >= 1e3) return (n / 1e3).toFixed(n >= 1e4 ? 0 : 1) + 'K';
	return String(Math.round(n));
}

export function formatBytes(n: number): string {
	if (n >= 1e6) return (n / 1e6).toFixed(2) + ' MB';
	if (n >= 1e3) return (n / 1e3).toFixed(1) + ' KB';
	return Math.round(n) + ' B';
}
