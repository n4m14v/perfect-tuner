/**
 * Converts a hex colour string (e.g. "#ff6a00") to a comma-separated RGB string
 * (e.g. "255,106,0") suitable for use in CSS rgba() values.
 */
export function hexToRgb(hex: string): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r},${g},${b}`;
}

/**
 * Octave-folds `freq` until it sits within ~30% of `target`.
 * This lets us compare a note across octaves without caring which octave the mic hears.
 */
export function foldToTarget(freq: number, target: number): number {
    let f = freq;
    while (f < target * 0.7) f *= 2;
    while (f > target * 1.4) f /= 2;
    return f;
}

/**
 * Applies an accent colour to the document root as CSS custom properties:
 *   --accent       : the hex colour
 *   --accent-rgb   : comma-separated RGB (for use in rgba())
 *   --accent-dim   : rgba at 15% opacity
 */
export function applyAccent(color: string): void {
    const rgb = hexToRgb(color);
    document.documentElement.style.setProperty('--accent', color);
    document.documentElement.style.setProperty('--accent-rgb', rgb);
    document.documentElement.style.setProperty('--accent-dim', `rgba(${rgb},0.15)`);
}

/**
 * Calculates the difference in cents between two frequencies.
 * 100 cents = 1 semitone.
 */
export function getCentsDiff(freq: number, target: number): number {
    return 1200 * Math.log2(freq / target);
}
