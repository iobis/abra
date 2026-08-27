export const STALE = Symbol('stale-query');

/**
 * Guards against a slower, superseded query landing after a faster, more
 * recent one and overwriting the UI with stale data. Each component
 * instance that issues its own async queries (HexMap, BarChart, ...) should
 * create its own guard — a page can have several independent async
 * consumers of the same dataset, each with its own race to guard against.
 */
export function createLatestGuard() {
	let id = 0;
	return async function guard<T>(promise: Promise<T>): Promise<T | typeof STALE> {
		const mine = ++id;
		const result = await promise;
		return mine === id ? result : STALE;
	};
}
