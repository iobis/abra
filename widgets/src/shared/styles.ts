// Injected into each widget's shadow root so host-page CSS can never leak
// in or be leaked onto — shadow DOM's whole point for a drop-in widget.
export const baseStyles = `
:host {
	display: block;
	font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
	color: #0b0b0b;
	--obis-surface: #fcfcfb;
	--obis-border: rgba(11, 11, 11, 0.1);
	--obis-ink-secondary: #52514e;
	--obis-ink-muted: #898781;
	--obis-accent: #2a78d6;
}
* { box-sizing: border-box; }

.obis-controls {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 0.5rem 1rem;
	margin-bottom: 0.75rem;
}
.obis-field {
	display: flex;
	align-items: center;
	gap: 0.4rem;
	font-size: 0.78rem;
	color: var(--obis-ink-secondary);
	font-weight: 500;
	text-transform: capitalize;
}
.obis-field select {
	font: inherit;
	font-size: 0.85rem;
	padding: 0.28rem 0.45rem;
	border: 1px solid var(--obis-border);
	border-radius: 6px;
	background: var(--obis-surface);
	color: #0b0b0b;
	min-width: 9rem;
}

.obis-panel {
	position: absolute;
	z-index: 5;
	background: var(--obis-surface);
	border: 1px solid var(--obis-border);
	border-radius: 8px;
	padding: 0.55rem 0.7rem;
	font-size: 0.74rem;
	color: var(--obis-ink-secondary);
	box-shadow: 0 1px 4px rgba(11, 11, 11, 0.08);
	pointer-events: none;
}
.obis-legend { top: 0.75rem; right: 0.75rem; width: 12rem; }
.obis-legend-title { font-size: 0.76rem; font-weight: 600; color: #0b0b0b; margin-bottom: 0.35rem; }
.obis-legend-ramp { height: 0.55rem; border-radius: 3px; margin-bottom: 0.2rem; }
.obis-legend-scale { display: flex; justify-content: space-between; font-variant-numeric: tabular-nums; }
.obis-stats { bottom: 0.75rem; left: 0.75rem; }
.obis-stats .value { color: #0b0b0b; font-weight: 600; font-variant-numeric: tabular-nums; }

.obis-map {
	position: relative;
	width: 100%;
	aspect-ratio: 16 / 9;
	border-radius: 8px;
	overflow: hidden;
	background: var(--obis-surface);
}

.obis-chart-container { width: 100%; }

.obis-table { width: 100%; border-collapse: collapse; font-size: 0.82rem; }
.obis-table th, .obis-table td {
	text-align: left;
	padding: 0.4rem 0.6rem;
	border-bottom: 1px solid var(--obis-border);
	font-variant-numeric: tabular-nums;
}
.obis-table th { cursor: pointer; user-select: none; color: var(--obis-ink-secondary); font-weight: 600; }
.obis-table th:hover { color: var(--obis-accent); }
.obis-table-wrap { max-height: 24rem; overflow: auto; border: 1px solid var(--obis-border); border-radius: 8px; }

.obis-error { color: #b3261e; font-size: 0.85rem; padding: 0.5rem 0; }
.obis-loading { color: var(--obis-ink-muted); font-size: 0.85rem; padding: 0.5rem 0; }
`;
