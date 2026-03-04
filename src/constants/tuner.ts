/** Hz — frequency must be within this range to enter the "perfect" zone */
export const PERFECT_RANGE = 1.5;

/** Hz — frequency must exceed this range to EXIT the "perfect" zone (hysteresis buffer) */
export const PERFECT_EXIT = 2.5;

/** Hz — frequency is this far off before showing a "way high/low" warning */
export const WARNING_RANGE = 8;
